import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import testimonialData from "@/data/testimonial.json";

export interface Testimonial {
  name: string;
  role: string;
  age: string;
  experience: string;
  quote: string;
  focus: string;
  image: string;
}

const testimonials = testimonialData as Testimonial[];

/* Single configurable speed — px per second. Slow, premium, but continuously alive. */
const CAROUSEL_SPEED = 110;

/* Copies of the dataset rendered so the track always overlaps both viewport edges */
const COPIES = 3;

/* Per-card rotation (deg) — intentionally irregular, repeats across duplicated cards */
const ROTATIONS = [-6, 3, -4, 4, -3, 5];
/* Gentle vertical scatter — small, so the row stays near one baseline */
const LIFTS = [0, -6, 3, -3, 6, 0];

const MARKER_W = 32;

/* Neutral person-glyph fallback (data URI) used if a profile image fails to load */
const FALLBACK_AVATAR =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
      `<rect width="96" height="96" fill="#ececec"/>` +
      `<g fill="#a3a3a3"><circle cx="48" cy="36" r="12"/>` +
      `<path d="M48 51c-11 0-20 7.5-20 17.5 0 1.4 1.1 2.5 2.5 2.5h35c1.4 0 2.5-1.1 2.5-2.5 0-10-9-17.5-20-17.5z"/></g>` +
      `</svg>`,
  );

function Avatar({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? FALLBACK_AVATAR : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="size-9 shrink-0 rounded-full object-cover"
    />
  );
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  const tilt = ROTATIONS[index % ROTATIONS.length] ?? 0;
  const lift = LIFTS[index % LIFTS.length] ?? 0;

  return (
    <article
      className="flex h-[150px] w-[250px] shrink-0 flex-col rounded-2xl border border-ink/10 bg-card p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] sm:h-[162px] sm:w-[292px]"
      style={{ transform: `rotate(${tilt}deg) translateY(${lift}px)` }}
    >
      <div className="flex items-center gap-2.5">
        <Avatar src={t.image} alt={`${t.name} — member portrait`} />
        <div className="min-w-0">
          <h3 className="truncate font-display text-[0.8125rem] font-bold leading-tight tracking-tight text-foreground">
            {t.name}
          </h3>
          <p className="mt-0.5 truncate text-[0.625rem] leading-tight text-muted-foreground">
            {t.role} · {t.age}
          </p>
          <p className="mt-px truncate text-[0.5625rem] leading-tight text-muted-foreground/80">
            {t.experience}
          </p>
        </div>
      </div>

      <blockquote className="mt-2 line-clamp-3 flex-1 text-[0.625rem] leading-[1.45] text-muted-foreground sm:text-[0.6875rem]">
        <span
          aria-hidden="true"
          className="mr-0.5 select-none font-serif text-[1em] italic text-primary"
        >
          &ldquo;
        </span>
        {t.quote}
      </blockquote>

      <p className="mt-2 flex items-baseline gap-1.5 text-[0.5625rem] leading-none">
        <span className="font-semibold uppercase tracking-[0.14em] text-foreground/60">Focus:</span>
        <span className="truncate text-muted-foreground">{t.focus}</span>
      </p>
    </article>
  );
}

export function Testimonials() {
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
    const group = firstGroup as HTMLElement | null;

    if (track && firstCard && group) {
      const gap = parseFloat(getComputedStyle(group).columnGap || "0") || 0;
      const step = firstCard.offsetWidth + gap;
      if (step > 0) {
        stepRef.current = step;
        setWidthRef.current = step * testimonials.length;
      }
    }
    if (rail) railWidthRef.current = rail.offsetWidth;

    if (!startedRef.current) {
      startedRef.current = true;
      /* Start mid-cycle so both edges show partially clipped cards */
      position.current = setWidthRef.current * 0.55;
      render();
    }
  }, [render]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

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
    <section
      id="testimonials"
      className="w-full scroll-mt-24 overflow-hidden bg-background py-12 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
        <ScrollReveal>
          <h2 className="sk-testimonials-title text-center">
            <span>Voices of members who value</span>
            <span className="block">Quality over compromise</span>
          </h2>
        </ScrollReveal>
      </div>

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
            aria-label="Member testimonials"
            role="region"
            className="flex items-start gap-7 will-change-transform"
          >
            {Array.from({ length: COPIES }).map((_, copy) => (
              <div key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-start gap-7">
                {testimonials.map((t, i) => (
                  <TestimonialCard key={`${copy}-${t.name}`} t={t} index={i} />
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
    </section>
  );
}
