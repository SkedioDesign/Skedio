import { gsap } from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

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
