import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

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

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  direction = "up",
  scrub = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "h1" | "h2" | "h3" | "p" | "span";
  direction?: RevealDirection;
  scrub?: boolean;
}) {
  const ref = useScrollReveal<HTMLElement>(direction, delay, scrub);

  return (
    <Tag ref={ref as never} className={`sk-reveal-base ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * 3D Subtle Tilt on Mouse Movement for premium cards
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const onMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      };

      const onMouseLeave = () => {
        el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      };

      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseleave", onMouseLeave);

      return () => {
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: ref },
  );

  return ref;
}
