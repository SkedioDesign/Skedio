import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export type RevealDirection = "up" | "left" | "right" | "fade";

const FROM_RECORDS: Record<RevealDirection, gsap.TweenVars> = {
  up: { y: 32 },
  left: { x: -32 },
  right: { x: 32 },
  fade: { scale: 0.97 },
};

/**
 * Scroll-linked reveal powered by GSAP ScrollTrigger.
 * - `scrub: false` (default) fires once when the element enters the viewport.
 * - `scrub: true` binds the animation progress to scroll position.
 * Respects `prefers-reduced-motion` (content shown immediately, no motion).
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

      const from: gsap.TweenVars = { opacity: 0, ...FROM_RECORDS[direction] };
      const to: gsap.TweenVars = { opacity: 1, x: 0, y: 0, scale: 1 };

      if (scrub) {
        gsap.fromTo(el, from, {
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
        gsap.fromTo(el, from, {
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
    },
    { scope: ref, dependencies: [direction, delay, scrub] },
  );

  return ref;
}
