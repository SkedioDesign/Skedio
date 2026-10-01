import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { WebpImage } from "@/components/WebpImage";

/* Single configurable speed — px per second. Slow enough to read a card while
   it is on screen rather than to notice that something is moving. */
const CAROUSEL_SPEED = 45;

/* Copies of the dataset rendered so the track always overlaps both viewport edges */
const COPIES = 3;

/* Per-card rotation (deg) — intentionally irregular, repeats across duplicated cards */
const ROTATIONS = [-6, 3, -4, 4, -3, 5];
/* Gentle vertical scatter — small, so the row stays near one baseline */
const LIFTS = [0, -6, 3, -3, 6, 0];

const MARKER_W = 32;

/*
 * Fixed box at every breakpoint; only the width responds.
 *
 * 208px is a measured floor, not a guess. On a 390px phone a card cannot be
 * wider than the viewport, and the longest quote (393 chars) needs 8 wrapped
 * lines at 16.5px = 132px. Add the 72px of non-negotiable chrome (p-4, the
 * avatar/name header, the gap) and 204px is the minimum at a readable size.
 * The original 150/162px can only hold this text at ~9px, or on cards ~570px
 * wide, which no phone can show.
 *
 * Width carries the slack instead: 408px from sm up buys back the lines that
 * the shorter height costs. `line-clamp-12` is a backstop only — at this size
 * nothing reaches it.
 */
const CARD_H = 208;

/* Up to two initials pulled from the display name. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  return (first + last).toUpperCase();
}

/* Stands in for a portrait the client has not supplied — a face-less monogram
   reads as intentional, where an unrelated stock photo reads as a mistake. */
function Monogram({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-full bg-surface font-display text-[0.625rem] font-bold tracking-tight text-muted-foreground ring-1 ring-inset ring-border"
    >
      {initialsOf(name)}
    </span>
  );
}

/* Portrait when one is authored, monogram otherwise — including when an
   authored `image` 404s, so a missing asset degrades to the monogram rather
   than a broken-image icon. */
function Avatar({ src, name }: { src?: string | undefined; name: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <Monogram name={name} />;

  return (
    <WebpImage
      src={src}
      alt={`${name} portrait`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="size-8 shrink-0 rounded-full object-cover"
    />
  );
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  const tilt = ROTATIONS[index % ROTATIONS.length] ?? 0;
  const lift = LIFTS[index % LIFTS.length] ?? 0;

  return (
    <article
      className="flex w-[calc(100vw-32px)] max-w-[408px] shrink-0 flex-col rounded-2xl border border-ink/10 bg-card p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
      style={{ height: CARD_H, transform: `rotate(${tilt}deg) translateY(${lift}px)` }}
    >
      <div className="flex items-center gap-2.5">
        <Avatar src={t.image} name={t.name} />
        <div className="min-w-0">
          <p className="truncate font-display text-[0.8125rem] font-bold leading-tight tracking-tight text-foreground">
            {t.name}
          </p>
          <p className="mt-0.5 truncate text-[0.625rem] leading-tight text-muted-foreground">
            {t.company ? `${t.role} · ${t.company}` : t.role}
          </p>
        </div>
      </div>

      <blockquote className="mt-2 line-clamp-12 flex-1 text-[0.6875rem] leading-[1.5] text-muted-foreground sm:text-[0.75rem]">
        <span
          aria-hidden="true"
          className="mr-0.5 select-none font-serif text-[1em] italic text-primary"
        >
          &ldquo;
        </span>
        {t.quote}
      </blockquote>
    </article>
  );
}

function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  /* Single source of truth for scroll position (px). Unbounded; wrapped at render. */
  const position = useRef(0);
  const mode = useRef<"auto" | "manual">("auto");
  const dragging = useRef(false);
  const hovering = useRef(false);
  const reduced = useRef(false);
  const startedRef = useRef(false);

  const stepRef = useRef(1);
  const setWidthRef = useRef(1);
  const railWidthRef = useRef(128);
  // Cached flex gap (gap-7 = 28px). getComputedStyle() forces a style recalc,
  // so we read it once and reuse it across resize bursts.
  const gapCacheRef = useRef<number | null>(null);
  const resizeRafRef = useRef(0);
  const resizeTimerRef = useRef<number | null>(null);

  const drag = useRef<{
    id: number;
    startX: number;
    startVal: number;
    lastX: number;
    lastT: number;
  } | null>(null);

  const wrap = useCallback((v: number) => {
    const w = setWidthRef.current;
    const m = v % w;
    return m < 0 ? m + w : m;
  }, []);

  const render = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    /* Rebase to keep the float small and precision loss negligible */
    const setW = setWidthRef.current;
    if (Math.abs(position.current) > setW * 3) {
      position.current = wrap(position.current);
    }
    const offset = wrap(position.current) % setW;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;

    const marker = markerRef.current;
    if (marker) {
      const pct = setW > 0 ? offset / setW : 0;
      const x = pct * Math.max(railWidthRef.current - MARKER_W, 0);
      marker.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    }
  }, [wrap]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const rail = railRef.current;
    const firstGroup = track?.firstElementChild;
    const firstCard = firstGroup?.firstElementChild as HTMLElement | null;

    // READ phase: batch all layout reads before any writes. offsetWidth
    // reads are served from one layout pass since no DOM writes interleave.
    const cardW = firstCard ? firstCard.offsetWidth : 0;
    const railW = rail ? rail.offsetWidth : 0;

    if (track && firstCard && cardW > 0) {
      let gap = gapCacheRef.current;
      if (gap == null) {
        const group = firstGroup as HTMLElement | null;
        gap = group ? parseFloat(getComputedStyle(group).columnGap || "0") || 0 : 0;
        // Fallback to the authored gap-7 (28px) if computed style is blank.
        if (!gap) gap = 28;
        gapCacheRef.current = gap;
      }
      const step = cardW + gap;
      if (step > 0 && Math.abs(step - stepRef.current) > 0.5) {
        stepRef.current = step;
        setWidthRef.current = step * items.length;
      }
    }
    if (railW > 0 && Math.abs(railW - railWidthRef.current) > 0.5) {
      railWidthRef.current = railW;
    }

    if (!startedRef.current) {
      startedRef.current = true;
      /* Start mid-cycle so both edges show partially clipped cards */
      position.current = setWidthRef.current * 0.55;
      render();
    }
  }, [render, items.length]);

  useLayoutEffect(() => {
    measure();
    // rAF-throttled + debounced resize: coalesce high-frequency resize
    // events into one measure per frame, with a trailing 150ms re-check
    // for finished viewport changes (e.g. orientation, scrollbar).
    const onResize = () => {
      if (resizeRafRef.current) return;
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = 0;
        measure();
      });
      if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = window.setTimeout(() => {
        resizeTimerRef.current = null;
        // Gap can change with breakpoints — drop the cache on settle so the
        // next measure re-reads it once, then re-caches.
        gapCacheRef.current = null;
        measure();
        render();
      }, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = 0;
      if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = null;
    };
  }, [measure, render]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => (reduced.current = mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !window.matchMedia("(hover: hover)").matches) return;
    const enter = () => (hovering.current = true);
    const leave = () => (hovering.current = false);
    viewport.addEventListener("mouseenter", enter);
    viewport.addEventListener("mouseleave", leave);
    return () => {
      viewport.removeEventListener("mouseenter", enter);
      viewport.removeEventListener("mouseleave", leave);
    };
  }, []);

  useEffect(() => {
    const tick = (_time: number, deltaTime: number) => {
      const dt = Math.min(Math.max(deltaTime / 1000, 0), 0.05);
      if (mode.current === "auto" && !hovering.current && !dragging.current && !reduced.current) {
        position.current += CAROUSEL_SPEED * dt;
      }
      render();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [render]);

  const animateTo = useCallback((target: number, dur = 0.55, ease: string = "power2.inOut") => {
    mode.current = "manual";
    gsap.killTweensOf(position);
    gsap.to(position, {
      current: target,
      duration: dur,
      ease,
      onComplete: () => {
        mode.current = "auto";
        dragging.current = false;
      },
    });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      animateTo(position.current + dir * stepRef.current);
    },
    [animateTo],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    gsap.killTweensOf(position);
    mode.current = "manual";
    dragging.current = true;
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startVal: position.current,
      lastX: e.clientX,
      lastT: performance.now(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const now = performance.now();
    position.current = d.startVal - (e.clientX - d.startX);
    d.lastX = e.clientX;
    d.lastT = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;

    const now = performance.now();
    const dt = Math.max(now - d.lastT, 1);
    const releaseVel = (e.clientX - d.lastX) / dt; /* px per ms */
    const spin = releaseVel * 500;
    let target = position.current - spin;
    target = Math.round(target / stepRef.current) * stepRef.current;
    animateTo(target, 0.5, "power3.out");
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const target = Math.round(position.current / stepRef.current) * stepRef.current;
    animateTo(target, 0.4, "power3.out");
  };

  return (
    <div>
      <div className="mt-9 lg:mt-12">
        <div
          ref={viewportRef}
          className="overflow-hidden py-8 lg:py-10"
          style={{ touchAction: "pan-y" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            ref={trackRef}
            aria-label="Client testimonials"
            role="region"
            className="flex items-start gap-7 will-change-transform"
          >
            {Array.from({ length: COPIES }).map((_, copy) => (
              <div key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-start gap-7">
                {items.map((t, i) => (
                  <TestimonialCard key={`${copy}-${t.slug}`} t={t} index={i} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 px-6 md:px-12">
        <ScrollReveal delay={1}>
          <div className="flex items-center justify-center gap-4 sm:gap-5">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous testimonial"
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-border bg-surface text-foreground transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-ink-foreground sm:size-10"
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} />
            </button>

            <div
              ref={railRef}
              aria-hidden="true"
              className="relative h-0.5 w-28 overflow-visible rounded-full bg-border sm:w-40"
            >
              <span
                ref={markerRef}
                className="absolute inset-y-0 left-0 w-8 rounded-full bg-foreground/50"
                style={{ transform: "translate3d(0, 0, 0)" }}
              />
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next testimonial"
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary-hover sm:size-10"
            >
              <ChevronRight className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

/**
 * Homepage testimonials section. Renders nothing at all while the dataset is
 * empty — a heading stranded above an absent carousel reads as a broken page,
 * and the marquee's wrap arithmetic divides by a set width it can never
 * measure. Adding the first record to `src/data/testimonials.ts` restores both.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="w-full scroll-mt-24 overflow-hidden bg-background py-12 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
        <ScrollReveal>
          <h2 className="sk-testimonials-title text-center">
            <span>What the people we build for</span>{" "}
            <span className="block">Say about working with us</span>
          </h2>
        </ScrollReveal>
      </div>

      <TestimonialCarousel items={testimonials} />
    </section>
  );
}
