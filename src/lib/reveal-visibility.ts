/**
 * Scheduling primitives for scroll-reveal animations.
 *
 * Two problems this solves, both of which used to be paid once per reveal
 * element (there are ~13 on a typical page):
 *
 * 1. `element.getBoundingClientRect()` called from a layout effect forces a
 *    synchronous layout, because React has usually just mutated the DOM in the
 *    same commit. Doing it per element turned one hydration pass into a dozen
 *    forced reflows, which Chrome attributes to the React chunk.
 *    An IntersectionObserver answers the same "is this near the viewport?"
 *    question off the main thread, with no forced layout at all.
 *
 * 2. `window.matchMedia("(prefers-reduced-motion: reduce)")` re-evaluates style
 *    on every call. Cached once per app and kept current with a change listener.
 *
 * The observer threshold is deliberate: the old code compared against
 * `innerHeight * 1.5`, so the root is extended by 50% of the viewport height to
 * match. Elements therefore still become "near" at exactly the same scroll
 * position, and the ScrollTrigger that gets built from that is unchanged.
 */

/** Matches the previous `getBoundingClientRect().top < innerHeight * 1.5`. */
const NEAR_VIEWPORT_ROOT_MARGIN = "0px 0px 50% 0px";

export type RevealReadiness = "near" | "already-passed";

let observer: IntersectionObserver | null = null;
const pending = new Map<Element, (state: RevealReadiness) => void>();

function ensureObserver(): IntersectionObserver | null {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const ready = pending.get(entry.target);
        if (!ready) continue;
        // Near the viewport: build the trigger now so it exists before the
        // element reaches its ScrollTrigger start line.
        if (entry.isIntersecting) {
          finish(entry.target, "near");
          continue;
        }
        // Above the viewport and not intersecting means the visitor already
        // scrolled past it. The old synchronous read handled this by creating
        // the trigger immediately, and ScrollTrigger fired onEnter straight
        // away — so do the same, otherwise the element would stay at
        // opacity 0 forever.
        if (entry.boundingClientRect.top < 0) finish(entry.target, "already-passed");
      }
    },
    { rootMargin: NEAR_VIEWPORT_ROOT_MARGIN },
  );
  return observer;
}

function finish(el: Element, state: RevealReadiness): void {
  const ready = pending.get(el);
  if (!ready) return;
  pending.delete(el);
  observer?.unobserve(el);
  ready(state);
}

/**
 * Runs `ready` once the element is close enough to the viewport to warrant
 * building its ScrollTrigger, or immediately if it is already scrolled past.
 * Returns a cancel function; safe to call when the element unmounted first.
 */
export function onRevealNearViewport(
  el: Element,
  ready: (state: RevealReadiness) => void,
): () => void {
  const io = ensureObserver();
  if (!io) {
    // No IntersectionObserver: fall back to the original single read. Rare
    // (every supported browser has it), but it must not silently hide content.
    const near = el.getBoundingClientRect().top < window.innerHeight * 1.5;
    ready(near || el.getBoundingClientRect().top < 0 ? "near" : "already-passed");
    return () => {};
  }
  pending.set(el, ready);
  io.observe(el);
  return () => {
    if (!pending.delete(el)) return;
    io.unobserve(el);
  };
}

/* ------------------------- reduced motion ------------------------- */

let reducedMotionQuery: MediaQueryList | null = null;
let reducedMotion: boolean | null = null;

// A single app-lifetime listener keeps the cached value honest if the OS
// setting changes mid-session; there is no teardown path for a module
// singleton, and no listener is registered at all on the server.
function ensureReducedMotionQuery(): MediaQueryList | null {
  if (reducedMotionQuery || typeof window === "undefined") return reducedMotionQuery;
  reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sync = (e: MediaQueryListEvent | MediaQueryList) => {
    reducedMotion = e.matches;
  };
  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", sync);
  }
  reducedMotion = reducedMotionQuery.matches;
  return reducedMotionQuery;
}

/** Cached `prefers-reduced-motion` — one matchMedia for the whole app. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  ensureReducedMotionQuery();
  return reducedMotion ?? false;
}
