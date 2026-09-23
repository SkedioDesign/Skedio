import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Keeps ScrollTrigger in lock-step with Lenis's eased scroll. Without this,
 * ScrollTrigger measures raw scroll while Lenis renders interpolated positions,
 * which causes animation lag/jitter.
 */
function ScrollSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return null;
}

/**
 * Global smooth-scroll layer. Replaces the old hand-rolled SmoothScroll engine
 * (src/lib/smooth-scroll.ts). Lenis keeps the native scrollbar + accessibility,
 * and it is driven from GSAP's ticker so Lenis and ScrollTrigger share one RAF
 * clock — no fighting loops = buttery 120/144Hz scrolling.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  const smoothTouch = typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches;

  useGSAP(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
      ScrollTrigger.update();
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
    };
  });

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        anchors: true,
        autoToggle: true,
        lerp: 0.085,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        smoothWheel: true,
        syncTouch: smoothTouch,
      }}
    >
      {children}
      <ScrollSync />
    </ReactLenis>
  );
}
