import { gsap } from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

/**
 * 3D Subtle Tilt on Mouse Movement for premium cards.
 * Perf: caches getBoundingClientRect() (no per-mousemove layout read),
 * coalesces pointer events through a single rAF, and animates via GSAP
 * transform properties (compositor-only, no layout).
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let rect: DOMRect | null = null;
      let raf = 0;
      let targetX = 0;
      let targetY = 0;
      let hovering = false;

      const refreshRect = () => {
        rect = el.getBoundingClientRect();
      };

      const applyTilt = () => {
        raf = 0;
        if (!hovering || !rect) return;
        const centerX = rect.width / 2 || 1;
        const centerY = rect.height / 2 || 1;
        const rotateY = ((targetX - centerX) / centerX) * 4;
        const rotateX = ((targetY - centerY) / centerY) * -4;
        // Transform-only write via GSAP — no layout, interruptible.
        gsap.to(el, {
          rotationX: rotateX,
          rotationY: rotateY,
          y: -4,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const schedule = () => {
        if (raf) return;
        raf = requestAnimationFrame(applyTilt);
      };

      const onMouseEnter = () => {
        hovering = true;
        refreshRect();
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!rect) refreshRect();
        // rect.left/top cached; clientX/Y are event coords (no layout read).
        targetX = e.clientX - (rect?.left ?? 0);
        targetY = e.clientY - (rect?.top ?? 0);
        schedule();
      };

      const onMouseLeave = () => {
        hovering = false;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          y: 0,
          transformPerspective: 1000,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      // Cache is invalidated on enter + viewport changes; scroll/resize use
      // passive listeners and only re-read when hovering.
      const onViewportChange = () => {
        if (hovering) refreshRect();
      };

      refreshRect();
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("scroll", onViewportChange, { passive: true });
      window.addEventListener("resize", onViewportChange);

      return () => {
        hovering = false;
        if (raf) cancelAnimationFrame(raf);
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("scroll", onViewportChange);
        window.removeEventListener("resize", onViewportChange);
        gsap.killTweensOf(el);
      };
    },
    { scope: ref },
  );

  return ref;
}
