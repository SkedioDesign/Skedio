import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { loadScrollTrigger, onAnimationIdle } from "@/lib/animation-loader";

// Type-only: `typeof import(...)` in type position is erased at compile time,
// so lenis itself still loads on demand below — zero critical-path bytes.
type LenisModule = typeof import("lenis/react");

/**
 * Keeps ScrollTrigger in lock-step with Lenis's eased scroll. Without this,
 * ScrollTrigger measures raw scroll while Lenis renders interpolated positions,
 * which causes animation lag/jitter. Both Lenis and ScrollTrigger arrive via
 * the deferred loader; until then there is nothing to sync.
 */
function ScrollSync({ useLenis }: { useLenis: LenisModule["useLenis"] }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    let cancelled = false;
    let off: (() => void) | undefined;
    void loadScrollTrigger().then((mod) => {
      if (cancelled || !mod) return;
      const onScroll = () => mod.ScrollTrigger.update();
      lenis.on("scroll", onScroll);
      off = () => lenis.off("scroll", onScroll);
    });
    return () => {
      cancelled = true;
      off?.();
    };
  }, [lenis]);

  return null;
}

/**
 * Global smooth-scroll layer. Lenis keeps the native scrollbar +
 * accessibility, and it is driven from GSAP's ticker so Lenis and
 * ScrollTrigger share one RAF clock — no fighting loops.
 *
 * LCP: the `lenis/react` wrapper (~20KB raw) loads AFTER the critical path
 * (main-thread idle, 2.5s backstop). Before it arrives the page scrolls
 * natively — identical content, identical anchors, zero layout shift. When
 * the chunk lands, ReactLenis mounts around the existing tree and takes over
 * at the current scroll position, so there is no jump.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenisMod, setLenisMod] = useState<LenisModule | null>(null);

  // Memoized so we don't call matchMedia on every render (it forces style
  // evaluation). Computed once per mount.
  const smoothTouch = useMemo(
    () => typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  useEffect(() => {
    let cancelled = false;
    void onAnimationIdle()
      .then(() => import("lenis/react"))
      .then((mod) => {
        if (!cancelled) setLenisMod(mod);
      })
      .catch(() => {
        /* Native scroll stays — smooth scrolling is progressive enhancement. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const lenisRef = useRef<React.ComponentRef<LenisModule["ReactLenis"]>>(null);

  useGSAP(() => {
    // Single RAF clock: ticker drives Lenis only. ScrollTrigger is updated
    // from Lenis's scroll event in <ScrollSync /> — calling
    // ScrollTrigger.update() here too forced a full trigger re-measurement
    // (layout reads) on every tick, doubling reflow cost.
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
    };
  });

  if (!lenisMod) return <>{children}</>;

  const SmoothRoot = lenisMod.ReactLenis;
  return (
    <SmoothRoot
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
      <ScrollSync useLenis={lenisMod.useLenis} />
    </SmoothRoot>
  );
}
