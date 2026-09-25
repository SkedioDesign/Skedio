/**
 * On-demand loader for below-fold animation machinery (GSAP ScrollTrigger).
 *
 * GSAP core + SplitText stay in the initial bundle: the above-fold hero
 * entrance runs at hydration, so that code is genuinely "used" during load.
 * ScrollTrigger only drives scroll-linked reveals (below the fold), so it is
 * fetched after the critical path — on main-thread idle, on first scroll
 * intent, or immediately for elements already near the viewport — whichever
 * comes first.
 *
 * The promise never rejects: it resolves `null` on the server, when the
 * network fails, or under reduced motion, so callers fall back to showing
 * content statically instead of leaving it hidden.
 */

import { gsap } from "gsap";

type ScrollTriggerModule = {
  ScrollTrigger: {
    update: () => void;
    refresh: () => void;
    create: (vars: {
      trigger: Element;
      start?: string;
      end?: string;
      scrub?: boolean | number;
      once?: boolean;
      onEnter?: () => void;
    }) => { kill: () => void };
  };
};

let cached: Promise<ScrollTriggerModule | null> | null = null;
let fetchStarted = false;
let gate: Promise<void> | null = null;

/**
 * Resolves after the critical path: main-thread idle, first scroll intent,
 * or a 2.5s backstop — whichever comes first. Shared by all deferred
 * below-fold machinery (ScrollTrigger, Lenis) so they start together.
 */
export function onAnimationIdle(): Promise<void> {
  if (gate) return gate;
  gate = new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      cleanup();
      resolve();
    };
    const cleanup = () => {
      window.removeEventListener("scroll", finish);
      window.removeEventListener("touchstart", finish);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("wheel", finish);
    };
    // First scroll intent means the user is heading toward animated content —
    // start fetching immediately instead of waiting for idle.
    window.addEventListener("scroll", finish, { passive: true, once: true });
    window.addEventListener("touchstart", finish, { passive: true, once: true });
    window.addEventListener("pointerdown", finish, { passive: true, once: true });
    window.addEventListener("wheel", finish, { passive: true, once: true });

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(finish, { timeout: 2500 });
    } else {
      window.setTimeout(finish, 1500);
    }
  });
  return gate;
}

function fetchModule(): Promise<ScrollTriggerModule | null> {
  fetchStarted = true;
  return import("gsap/ScrollTrigger")
    .then((mod) => {
      gsap.registerPlugin(mod.ScrollTrigger);
      return mod as unknown as ScrollTriggerModule;
    })
    .catch(() => null);
}

/**
 * Resolves the ScrollTrigger module (registered with GSAP core), or `null`
 * when it cannot be loaded. Pass `immediate: true` for elements already near
 * the viewport — skips the idle gate so above-fold reveals don't wait. An
 * immediate request upgrades an already-pending idle-gated load.
 */
export function loadScrollTrigger(options?: {
  immediate?: boolean;
}): Promise<ScrollTriggerModule | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Promise.resolve(null);
  }
  if (!cached) {
    cached = (options?.immediate ? Promise.resolve() : onAnimationIdle()).then(fetchModule);
  } else if (options?.immediate && !fetchStarted) {
    const eager = fetchModule();
    const gated = cached;
    cached = gated.then((g) => eager.then((e) => e ?? g));
  }
  return cached;
}
