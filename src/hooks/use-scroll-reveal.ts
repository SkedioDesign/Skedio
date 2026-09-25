import { gsap } from "gsap";
// Type-only: restores the `scrollTrigger` TweenVars augmentation and the
// `tween.scrollTrigger` accessor without bundling ScrollTrigger itself
// (it loads on demand via lib/animation-loader.ts).
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { loadScrollTrigger } from "@/lib/animation-loader";

export type RevealDirection = "up" | "left" | "right" | "fade";

const FROM_RECORDS: Record<RevealDirection, gsap.TweenVars> = {
  up: { y: 32 },
  left: { x: -32 },
  right: { x: 32 },
  fade: { scale: 0.97 },
};

/**
 * Scroll-linked reveal. GSAP core runs the tween (already in the initial
 * bundle for the hero); ScrollTrigger itself loads on demand AFTER the
 * critical path (see lib/animation-loader.ts) so its bytes/parse cost don't
 * weigh on LCP/TBT.
 * - `scrub: false` (default) fires once when the element enters the viewport.
 * - `scrub: true` binds the animation progress to scroll position.
 * Respects `prefers-reduced-motion` (content shown immediately, no motion,
 * no ScrollTrigger download at all). If the ScrollTrigger chunk fails to
 * load, content is forced visible instead of staying hidden.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  direction: RevealDirection = "up",
  delay = 0,
  scrub = false,
) {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { opacity: 1, clearProps: "transform" });
        return;
      }

      // Elements already near the viewport skip the idle gate — they may be
      // visible on load and must not wait. Everything else loads ScrollTrigger
      // on idle/first-scroll via the shared loader.
      const nearViewport =
        typeof window !== "undefined" &&
        el.getBoundingClientRect().top < window.innerHeight * 1.5;

      let cancelled = false;
      // gsap.Tween isn't addressable as a namespace member in this GSAP
      // version's types; a structural minimal type covers cleanup needs.
      let tween: {
        kill: () => void;
        scrollTrigger?: { kill: () => void } | null;
      } | null = null;

      void loadScrollTrigger({ immediate: nearViewport }).then((mod) => {
        if (cancelled) return;
        if (!mod) {
          // ScrollTrigger unavailable (failed fetch / reduced motion):
          // never leave content hidden behind `.sk-reveal-base { opacity: 0 }`.
          gsap.set(el, { opacity: 1, clearProps: "transform" });
          return;
        }
        const from: gsap.TweenVars = { opacity: 0, ...FROM_RECORDS[direction] };
        const to: gsap.TweenVars = { opacity: 1, x: 0, y: 0, scale: 1 };

        if (scrub) {
          tween = gsap.fromTo(el, from, {
            ...to,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 55%",
              scrub: true,
            },
          });
        } else {
          tween = gsap.fromTo(el, from, {
            ...to,
            duration: 0.85,
            ease: "power3.out",
            delay: delay * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          });
        }
      });

      return () => {
        cancelled = true;
        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = null;
      };
    },
    { scope: ref, dependencies: [direction, delay, scrub] },
  );

  return ref;
}
