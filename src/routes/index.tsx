import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Volume2, VolumeX, Zap } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactModal } from "@/context/use-contact-modal";
import { loadScrollTrigger } from "@/lib/animation-loader";
import { afterPageLoaderExit } from "@/lib/page-loader";
import { seo, canonicalLink } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { SiteHeader } from "@/components/SiteHeader";
import { WebpImage } from "@/components/WebpImage";
import { WhatWeDo } from "@/components/WhatWeDo";
import { SelectedWork } from "@/components/SelectedWork";
import { BlogPreview } from "@/components/BlogPreview";
import { Clients } from "@/components/Clients";
import { Testimonials } from "@/components/Testimonials";
import { FaqItem } from "@/components/FaqAccordion";
import { getFAQSchema, getWebPageSchema } from "@/lib/schema";
import {
  COLLAGE_COLUMNS,
  COLLAGE_DWELL_MS,
  COLLAGE_STAGGER_MS,
  HERO_GATES,
  HERO_TRACK_VH,
  LOGOS_DWELL_MS,
  SLIDE_MS,
  heroCollageImages,
  spansTwoColumns,
} from "@/lib/hero-collage";
import { clients } from "@/data/clients";
import { servicesData } from "@/data/services";
import { generalFaqs } from "@/data/faq";

import heroDesktopAvif from "@/assets/hero.avif";
import heroDesktopWebp from "@/assets/hero.webp";
import hero1280Avif from "@/assets/hero-1280.avif";
import hero1280Webp from "@/assets/hero-1280.webp";
import hero1024Avif from "@/assets/hero-1024.avif";
import hero1024Webp from "@/assets/hero-1024.webp";
import hero768Avif from "@/assets/hero-768.avif";
import hero768Webp from "@/assets/hero-768.webp";
import heroMobileAvif from "@/assets/hero-mobile.avif";
import heroMobileWebp from "@/assets/hero-mobile.webp";
import heroMobile480Avif from "@/assets/hero-mobile-480.avif";
import heroMobile480Webp from "@/assets/hero-mobile-480.webp";
import heroFallback from "@/assets/hero.jpg";
import heroFallback768 from "@/assets/hero-768.jpg";
import heroFallback1024 from "@/assets/hero-1024.jpg";
import heroFallback1280 from "@/assets/hero-1280.jpg";
// Route-scoped serif — see src/fraunces.css and the head() note below.
import frauncesCss from "@/fraunces.css?url";

gsap.registerPlugin(SplitText);

/**
 * Injects the route-scoped serif stylesheet (see src/fraunces.css).
 * `fetchPriority` is a no-op on browsers that don't support it, which is
 * fine — the link being async is what keeps it off the blocking path.
 */
const loadFrauncesAsync =
  `(function(){try{var l=document.createElement("link");l.rel="stylesheet";` +
  `l.href=${JSON.stringify(frauncesCss)};l.fetchPriority="low";` +
  `document.head.appendChild(l)}catch(e){}})()`;

/**
 * `sizes` for the hero <picture>, shared by the preload links and the
 * <source>/<img> elements below.
 *
 * The visual is full-bleed inside a `max-w-[1440px]` section with `px-6`
 * (24px/side) and `md:px-12` (48px/side), so the rendered width is
 * `min(100vw, 1440) - 96` and therefore CAPS at 1344px — past ~1536px of
 * viewport it stops growing. That cap is why the desktop branch is a fixed
 * `1344px` rather than another `100vw` expression.
 *
 * Declared once because the preload's `imageSizes` and the `<source sizes>`
 * MUST be the identical string: if they disagree the browser picks a different
 * candidate for the preload than for the image and downloads two files.
 */
const HERO_DESKTOP_SIZES = "(max-width: 1440px) calc(100vw - 96px), 1344px";
const HERO_MOBILE_SIZES = "calc(100vw - 48px)";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({
      title: "Skédio — UI/UX Design, Identity & Digital Studio",
      description:
        "Skédio is a creative studio crafting bold brands, beautiful digital experiences, and high-performance digital products that help businesses grow.",
      url: "/",
    }),
    links: [
      ...canonicalLink("/"),
      // Preload the LCP hero image early so discovery doesn't wait for the
      // <picture> to parse.
      //
      // `imagesrcset` + `imagesizes` (not a bare `href`) is the load-bearing
      // detail. The <picture> below picks its candidate from a 4-entry srcset
      // via `sizes`, so a preload naming ONE fixed URL matches only by luck:
      // measured with Playwright, `href={hero1280Avif}` matched at a 1280px
      // viewport and double-downloaded everywhere else — at 1440px both
      // hero-1280 (preload) and hero-1440 (what actually rendered) were
      // fetched, and at 390px a 720w preload was fetched while the 480w source
      // that actually rendered came down second. Handing the preload the SAME
      // srcset+sizes pair makes the browser run the identical selection, so the
      // preload is deduplicated against the <img> request at every width.
      // `href` remains as the fallback for engines that ignore imagesrcset —
      // it points at the SMALLEST candidate, so an approximate preload there
      // wastes as few bytes as possible.
      {
        rel: "preload",
        as: "image",
        href: hero768Avif,
        imageSrcSet: `${hero768Avif} 768w, ${hero1024Avif} 1024w, ${hero1280Avif} 1280w, ${heroDesktopAvif} 1440w`,
        imageSizes: HERO_DESKTOP_SIZES,
        type: "image/avif",
        media: "(min-width: 1024px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: heroMobile480Avif,
        imageSrcSet: `${heroMobile480Avif} 480w, ${heroMobileAvif} 720w`,
        imageSizes: HERO_MOBILE_SIZES,
        type: "image/avif",
        media: "(max-width: 1023px)",
        fetchPriority: "high",
      },
    ],
    scripts: [
      // Fraunces is the one family this page genuinely needs that nothing
      // above the fold uses. Its only two renderers here — BlogPreview's
      // numerals and title, and Testimonials' quote glyph — live in
      // below-fold headings that sit opacity-0 behind ScrollReveal until
      // they scroll into view. So the ~82 KB roman + italic can load after
      // first paint without a visible reflow.
      //
      // A <link> in `links` would still be render-blocking and would put
      // 82 KB in front of the preloaded hero image that is this page's
      // LCP element. Appending the element from an inline script keeps it
      // off the blocking path and marks it `fetchPriority="low"` so it
      // queues behind the hero. The CSP nonce is applied by TanStack
      // (`ssr.nonce` in src/router.tsx), so this script is allowed by
      // `script-src 'self' 'nonce-…'`.
      { children: loadFrauncesAsync },
    ],
  }),
  component: Index,
});

/**
 * Partner marquee logos serve tiny variants: the desktop card renders at
 * h-40 (160px) and mobile at h-32 (128px), so 160w covers 1x and 320w
 * covers 2x DPR/Retina. The 1080px originals (~31KB WebP) are never
 * downloaded — 160w is ~4KB WebP (~2KB PNG) and 320w is ~9KB (~4KB PNG).
 */
const PARTNER_LOGO_SIZES = "160px";

const partnerLogos = [
  {
    type: "text" as const,
    id: "sc",
    label: "Social Chums",
    img: "/Social%20Chums-320.png",
    imgSrcSet: "/Social%20Chums-160.png 160w, /Social%20Chums-320.png 320w",
    webpSrcSet: "/Social%20Chums-160.webp 160w, /Social%20Chums-320.webp 320w",
  },
  {
    type: "text" as const,
    id: "ed",
    label: "Edios",
    img: "/Edios-320.png",
    imgSrcSet: "/Edios-160.png 160w, /Edios-320.png 320w",
    webpSrcSet: "/Edios-160.webp 160w, /Edios-320.webp 320w",
  },
  { type: "text" as const, id: "chisel", label: "Chisel UI" },
];

// Two identical copies so the track's -50% translate loops seamlessly.
const marqueeLogos = [...partnerLogos, ...partnerLogos].map((item, i) => ({
  ...item,
  isRepeat: i >= partnerLogos.length,
}));

function PillLink({
  href,
  onClick,
  children,
  variant = "solid",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "solid" | "ink" | "outline";
}) {
  const styles =
    variant === "outline"
      ? "border border-border bg-transparent text-foreground hover:border-ink hover:bg-ink hover:text-ink-foreground"
      : variant === "ink"
        ? "bg-ink text-ink-foreground hover:bg-primary"
        : "bg-primary text-primary-foreground hover:bg-primary-hover";

  const sizes = variant === "ink" ? "px-5 py-3 md:px-7" : "px-6 py-3";

  const Comp = onClick ? "button" : "a";
  const props = onClick ? { type: "button" as const, onClick } : { href };

  return (
    <Comp
      {...props}
      className={`group type-button inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full transition-colors duration-250 ease-out ${sizes} ${styles}`}
    >
      {children}
      <span
        className={`grid place-items-center rounded-full transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
          variant === "ink" ? "size-7 bg-white/20 md:size-8" : "size-7 bg-foreground/10"
        }`}
      >
        <ArrowUpRight className={variant === "ink" ? "size-3.5 md:size-4" : "size-3.5"} />
      </span>
    </Comp>
  );
}

function Index() {
  const { openContactModal } = useContactModal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);

  // "Show more" and the accordion both change the document height, and
  // ScrollTrigger caches absolute trigger positions. Without a refresh the
  // reveals below the FAQ list keep firing against stale offsets. Deferred
  // past the 0.5s accordion tween so the measurement lands on final heights.
  useEffect(() => {
    const id = window.setTimeout(
      () => void loadScrollTrigger().then((mod) => mod?.ScrollTrigger.refresh()),
      600,
    );
    return () => window.clearTimeout(id);
  }, [showMore, openFaq]);

  const pageRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  // Autoplay policies only permit an unattended video to start while muted, so
  // this starts true and the visible control is an unmute affordance.
  const [heroMuted, setHeroMuted] = useState(true);

  // Post-video sequence, driven by scroll position rather than a timer. The
  // hero is a sticky stage inside a tall track: crossing a gate releases the
  // next beat, but a dwell floor stops a hard flick from blasting past them
  // all in one frame. Scrolling back up rewinds and replays.
  const [heroPhase, setHeroPhase] = useState<"video" | "logos" | "collage" | "slideshow">("video");
  // The collage's <img> elements are mounted only once the collage stage is
  // reached. 14 images cannot be part of the initial payload without wrecking
  // the LCP this hero works to protect, and none are visible before that point
  // anyway, so there is nothing to load early. The slideshow reuses these same
  // nodes, which is why mounting once serves both stages.
  const [collageMounted, setCollageMounted] = useState(false);
  // Index of the full-frame slide on screen. Stays null until the slideshow
  // starts, which is also what keeps the slideshow layer out of the DOM until
  // then. Wraps back to 0 so the sequence loops indefinitely.
  const [slideIndex, setSlideIndex] = useState<number | null>(null);
  // Bumped when the video finishes. The scroll evaluator holds no React state
  // of its own, so this is the signal that makes it re-read progress the
  // instant `ended` fires — otherwise a visitor parked at the video gate would
  // sit on a frozen final frame until they happened to scroll again.
  const [heroEndedTick, setHeroEndedTick] = useState(0);
  // Mirrors prefers-reduced-motion into React state, because the hero's LAYOUT
  // depends on it (pinned stage vs plain hero) and that has to be decided at
  // render, not inside an effect. Seeded false so the server and the first
  // client render agree; the effect corrects it before paint matters. Without
  // this the pinning would ship to reduced-motion visitors, whose complaint is
  // precisely about things moving on scroll.
  const [heroPrefersReducedMotion, setHeroPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setHeroPrefersReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Refs for bookkeeping that must be readable without causing a render.
  // phaseRef is the source of truth for "what is on screen right now"; heroPhase
  // is only the mirror that makes React re-run the GSAP timelines.
  const phaseRef = useRef<"video" | "logos" | "collage" | "slideshow">("video");
  const stageEnteredAtRef = useRef(0);
  const videoEndedRef = useRef(false);
  const playRequestedRef = useRef(false);
  const heroTrackRef = useRef<HTMLElement>(null);

  // Single entry point for playback, so the two triggers below cannot race into
  // a double play(). Idempotent: repeated calls after the first are no-ops.
  const requestPlayback = useCallback(() => {
    if (playRequestedRef.current) return;
    const video = heroVideoRef.current;
    if (!video) return;
    playRequestedRef.current = true;
    void video.play().catch(() => {});
  }, []);

  // Ordered so progress and stage can be compared arithmetically.
  type HeroStage = "video" | "logos" | "collage" | "slideshow";
  const STAGE_ORDER: Record<HeroStage, number> = { video: 0, logos: 1, collage: 2, slideshow: 3 };
  // The stage after `stage`. Written out rather than indexed out of an array:
  // `noUncheckedIndexedAccess` makes every array read `T | undefined`, and this
  // is a closed set of four, so the compiler should be able to see it is total.
  const nextStage = (stage: HeroStage): HeroStage =>
    stage === "video" ? "logos" : stage === "logos" ? "collage" : "slideshow";
  // Floor on how long a beat stays up before the next gate may release it.
  const STAGE_DWELL_MS = {
    video: 0,
    logos: LOGOS_DWELL_MS,
    collage: COLLAGE_DWELL_MS,
    slideshow: Number.POSITIVE_INFINITY,
  };

  // Stage transitions are funnelled through one function because each needs to
  // record when the new stage began (for dwell) and reset the slideshow on the
  // way into it.
  const goToStage = useCallback((next: "video" | "logos" | "collage" | "slideshow") => {
    if (phaseRef.current === next) return;
    const previous = phaseRef.current;
    phaseRef.current = next;
    stageEnteredAtRef.current = performance.now();
    setHeroPhase(next);
    if (next === "slideshow" && previous !== "slideshow") setSlideIndex(0);
    // Mount on first arrival and never unmount: the images are needed again if
    // the visitor scrolls back up and the sequence replays.
    if (next === "collage" || next === "slideshow") setCollageMounted(true);
  }, []);

  // Scroll position is the only clock for stage changes. Progress is measured
  // across the PIN DISTANCE (track height minus one viewport) rather than the
  // track height: the final viewport-height of scroll is spent with the sticky
  // stage already released, so dividing by offsetHeight would leave the last
  // gate unreachable.
  useEffect(() => {
    const track = heroTrackRef.current;
    if (!track) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    let dwellTimer: number | undefined;

    const evaluate = () => {
      frame = 0;
      if (dwellTimer !== undefined) {
        window.clearTimeout(dwellTimer);
        dwellTimer = undefined;
      }
      const rect = track.getBoundingClientRect();
      const pinDistance = track.offsetHeight - window.innerHeight;
      if (pinDistance <= 0) return;
      const progress = Math.min(Math.max(-rect.top / pinDistance, 0), 1);

      // Belt to the observer's braces. The observer watches the visual, but a
      // visitor who flicks the whole track in one gesture can carry the stage
      // past the viewport before 35% of it is ever on screen — and since the
      // logos wait on `ended`, that would hang the sequence on the poster
      // forever. Any movement into the track counts as "scroll onto the
      // section", so it starts playback too.
      if (progress > 0.02) requestPlayback();

      // The video gate is doubly guarded: scrolling past it is not enough, the
      // video must have actually finished. A visitor who scrolls hard while it
      // is still playing waits here rather than cutting to logos mid-shot.
      const target =
        progress < HERO_GATES.video || !videoEndedRef.current
          ? "video"
          : progress < HERO_GATES.logos
            ? "logos"
            : progress < HERO_GATES.collage
              ? "collage"
              : "slideshow";

      const current = phaseRef.current;
      // The video stage's dwell starts now, on the first evaluation. Left at 0
      // it would read as "held for the entire page lifetime" and let the first
      // transition fire instantly regardless of the dwell.
      if (stageEnteredAtRef.current === 0) stageEnteredAtRef.current = performance.now();

      // Re-arm the check for the stage we are about to enter. This is what keeps
      // the sequence moving after the visitor stops scrolling: having crossed
      // the last gate there is no further scroll event coming, so without a
      // self-scheduled re-check the run stalls one stage short of the slideshow
      // — every advance would consume the pending timer and never leave
      // another one behind.
      const armAfter = (stage: HeroStage) => {
        const dwell = STAGE_DWELL_MS[stage];
        if (Number.isFinite(dwell)) dwellTimer = window.setTimeout(evaluate, dwell);
      };

      // Scrolling back UP above a gate rewinds immediately, with no dwell: that
      // is the replay path, and making someone wait to undo something feels
      // broken. Only forward movement is dwell-gated.
      if (STAGE_ORDER[target] < STAGE_ORDER[current]) {
        goToStage(target);
        armAfter(target);
        return;
      }
      if (STAGE_ORDER[target] === STAGE_ORDER[current]) return;

      // Advance ONE stage per release, never straight to the furthest gate.
      // Jumping video -> collage skipped the logos entirely: the logos stage has
      // no dwell of its own to catch it, and a visitor who scrolls the whole
      // track in one gesture would never see a single client logo. Stepping
      // through in order also guarantees every stage gets its dwell measured,
      // because the next release cannot happen until this one has been entered.
      const heldMs = performance.now() - stageEnteredAtRef.current;
      if (heldMs >= STAGE_DWELL_MS[current]) {
        const next = nextStage(current);
        goToStage(next);
        armAfter(next);
        return;
      }
      // Blocked only by dwell, not by scroll position — so re-check when the
      // dwell expires.
      dwellTimer = window.setTimeout(evaluate, STAGE_DWELL_MS[current] - heldMs);
    };

    // rAF-coalesced: scroll fires far more events than the screen can show, and
    // each raw event would otherwise force its own layout read.
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (dwellTimer !== undefined) window.clearTimeout(dwellTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [goToStage, heroEndedTick, requestPlayback]);

  // Playback starts when the frame is actually on screen, not on mount. On
  // desktop the 16:9 stage begins ~700px down, so mount-time playback would
  // begin behind the fold; and gating on intersection keeps the 1.1MB video off
  // the critical path for anyone who lands mid-page via an anchor.
  //
  // The `autoplay` attribute is deliberately NOT used: it fires before this
  // effect can consult the query, so a reduced-motion visitor would get a flash
  // of motion before anything could pause it. Driving play() from here also
  // means that if JS is off, autoplay is refused (data saver, low-power mode),
  // or the codec is unsupported, nothing breaks — the poster layer just stays.
  //
  // "Played at once only": no `loop` attribute and no replay on `ended`, so it
  // runs through once and freezes on its final frame.
  useEffect(() => {
    const frame = heroVideoRef.current?.parentElement;
    if (!frame) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        requestPlayback();
      },
      { threshold: 0.35 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [requestPlayback]);

  // Slideshow: advance one slide every SLIDE_MS and wrap, so the sequence loops
  // for as long as the stage is held. This is the one stage not gated on scroll
  // — by the time the visitor reaches it the scroll budget is spent, and a
  // looping slideshow is what stops the pinned hero from going dead.
  const slidesTotal = heroCollageImages.length;
  useEffect(() => {
    if (heroPhase !== "slideshow" || slideIndex === null) return undefined;
    const id = window.setTimeout(
      () => setSlideIndex((i) => (i === null ? null : (i + 1) % slidesTotal)),
      SLIDE_MS,
    );
    return () => window.clearTimeout(id);
  }, [heroPhase, slideIndex, slidesTotal]);

  // Logo layer. Mounted only once the video has ended, so during playback the
  // frame contains nothing but the video — no 12 extra image requests competing
  // with the LCP element, and nothing to flash if the sequence never runs.
  useGSAP(
    () => {
      const root = pageRef.current;
      if (!root) return;
      const strip = root.querySelector<HTMLElement>("[data-hero-logos]");
      if (!strip) return;

      if (heroPhase === "logos") {
        gsap.fromTo(
          strip.querySelectorAll<HTMLElement>("[data-hero-client]"),
          { opacity: 0, scale: 0.7, y: 16 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: "back.out(1.7)",
            stagger: 0.045,
          },
        );
      } else {
        // "Shrink to a strip and stay": one transform carries the row from
        // centre stage down to a bottom strip. The logos are never unmounted,
        // so the client proof remains on screen for the rest of the sequence.
        gsap.to(strip, { scale: 0.6, duration: 0.85, ease: "power3.inOut" });
      }
    },
    { scope: pageRef, dependencies: [heroPhase] },
  );

  // Collage cards. Transform is owned entirely by GSAP — React sets no inline
  // transform at all, because a React-supplied one would be re-applied on every
  // render and fight the tween mid-flight. No rotation: the brief was a flush
  // collage, not scattered cards, so the only motion is a gentle rise.
  useGSAP(
    () => {
      const root = pageRef.current;
      if (!root || !collageMounted) return;
      const cards = root.querySelectorAll<HTMLElement>("[data-collage-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.94, yPercent: 8 },
          {
            opacity: 1,
            scale: 1,
            yPercent: 0,
            duration: 0.75,
            ease: "power2.out",
            delay: i * (COLLAGE_STAGGER_MS / 1000),
          },
        );
      });
    },
    { scope: pageRef, dependencies: [collageMounted] },
  );

  // Collage recedes, slideshow takes the frame. The collage is scaled down and
  // faded rather than removed, so the transition reads as the grid opening out
  // into a single screen instead of a hard cut.
  useGSAP(
    () => {
      const root = pageRef.current;
      if (!root || heroPhase !== "slideshow") return;
      const layer = root.querySelector<HTMLElement>("[data-collage-layer]");
      if (!layer) return;
      gsap.to(layer, { scale: 0.94, opacity: 0, duration: 1, ease: "power2.inOut" });
    },
    { scope: pageRef, dependencies: [heroPhase] },
  );

  // How many animation frames to wait before building the entrance.
  // `useGSAP` runs in a layout effect, i.e. BEFORE the browser paints the
  // hydrated tree, and SplitText.create() measures the heading to find word
  // boundaries. Doing that measurement there means a forced synchronous layout
  // inside the hydration commit. Two nested rAFs push the whole setup past the
  // LCP frame — the hero <img> paints first, then the animation runs. The cost
  // is ~2 frames (~32ms) of delay on a state that is already invisible.
  const HERO_ENTRANCE_DEFER_FRAMES = 2;

  useGSAP(
    () => {
      const root = pageRef.current;
      if (!root) return;

      // Reduced motion: bail BEFORE any query, SplitText or tween is built.
      // Nothing here needs to be undone — the reduced-motion block at the end
      // of this stylesheet already forces `opacity: 1 !important` on
      // `.sk-hero-start`, so skipping the JS entirely leaves the hero exactly
      // as the SSR HTML painted it. (It previously still ran three gsap.set()
      // calls to reach that same state.)
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let disposed = false;
      const rafs: number[] = [];
      let tl: gsap.core.Timeline | null = null;
      let split: ReturnType<typeof SplitText.create> | null = null;
      // The element SplitText rewrote, hoisted out of build() so the cleanup
      // below can clear the back-reference. See the comment at the split site.
      let trackedTitle:
        | (HTMLElement & {
            __skHeroSplit?: ReturnType<typeof SplitText.create>;
          })
        | null = null;

      const build = () => {
        if (disposed || !root.isConnected) return;

        const title = root.querySelector<HTMLElement>(".sk-hero-title");
        const accent = title?.querySelector<HTMLElement>(".sk-hero-accent") ?? null;

        // NOTE (LCP): [data-hero-visual] is intentionally EXCLUDED from the
        // opacity reveals. The hero <img> is this page's LCP element (verified
        // in Chrome: the winning candidate is the 1344x756 <img>, not the H1)
        // and it paints on the very first frame at opacity 1 — it is never gated
        // on GSAP or hydration. Only non-LCP hero chrome (pills, CTAs, proof,
        // partner card) participates in the opacity entrance, and the visual
        // gets a transform-only nudge so its first paint still counts for LCP.
        const reveals = Array.from(
          root.querySelectorAll<HTMLElement>(
            "[data-hero-lede], [data-hero-pill], [data-hero-cta], [data-hero-proof], [data-hero-partner]",
          ),
        );

        const visual = root.querySelector<HTMLElement>("[data-hero-visual]");

        // READS BEFORE WRITES. Every querySelector above and the Split() call
        // below happen BEFORE the first gsap.set()/fromTo(), and nothing after
        // this point reads geometry — so no write-then-read interleaving forces
        // a second synchronous layout within the setup.
        tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (title) {
          // SplitText rewrites the heading's children into its own <div>s, but
          // React still believes it owns those text nodes. If build() runs
          // twice on the same node — a hot replace can re-enter without the
          // previous cleanup landing, and the entrance is deferred by rAF so
          // cleanup has not necessarily run yet — React's next render
          // reconciles against foreign DOM and garbles the heading into a mix
          // of old and new words. Reverting any instance still attached to the
          // node makes build() idempotent: the fresh split always starts from
          // the server-rendered markup.
          trackedTitle = title as HTMLElement & {
            __skHeroSplit?: ReturnType<typeof SplitText.create>;
          };
          trackedTitle.__skHeroSplit?.revert();
          split = SplitText.create(title, { type: "words" });
          trackedTitle.__skHeroSplit = split;
          tl.set(title, { opacity: 1 }, 0).fromTo(
            split.words,
            { y: 38, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.045 },
          );
          if (accent) {
            tl.fromTo(
              accent,
              { scale: 0.75, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2.5)" },
              "<0.15",
            );
          }
        } else {
          tl.set([...reveals], { opacity: 0 }, 0);
        }

        tl.fromTo(
          root.querySelectorAll<HTMLElement>("[data-hero-lede]"),
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "<0.2",
        )
          .fromTo(
            root.querySelectorAll<HTMLElement>("[data-hero-pill]"),
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.06 },
            ">-0.25",
          )
          .fromTo(
            root.querySelectorAll<HTMLElement>("[data-hero-cta], [data-hero-proof]"),
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
            "-=0.28",
          )
          .fromTo(
            root.querySelectorAll<HTMLElement>("[data-hero-partner]"),
            { y: 24, opacity: 0, scale: 0.985 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 },
            ">-0.2",
          );

        // Transform-only nudge for the LCP visual: no opacity involved, and
        // immediateRender: false so nothing is hidden before the tween starts.
        // First paint (opacity 1, final layout) happens before JS runs.
        if (visual) {
          tl.fromTo(
            visual,
            { y: 24, scale: 0.985 },
            {
              y: 0,
              scale: 1,
              duration: 0.8,
              clearProps: "transform",
              immediateRender: false,
            },
            "<0.1",
          );
        }
      };

      let n = 0;
      const step = () => {
        if (disposed) return;
        if (n++ < HERO_ENTRANCE_DEFER_FRAMES) {
          rafs.push(requestAnimationFrame(step));
          return;
        }
        build();
      };
      // Hold the entrance until the intro overlay (components/PageLoader.tsx)
      // starts handing the screen over. Otherwise the whole ~1.3s timeline runs
      // underneath a fully opaque overlay and the visitor arrives at an
      // already-settled hero having watched none of it — the loader would cost
      // the page its entrance instead of introducing it.
      //
      // Only the non-LCP chrome is gated, never [data-hero-visual]: that image
      // still paints on the first frame underneath, so LCP is untouched.
      void afterPageLoaderExit().then(() => {
        if (disposed || !root.isConnected) return;
        rafs.push(requestAnimationFrame(step));
      });

      // Tweens built inside the deferred callback are created after
      // gsap.context() has already run, so useGSAP's automatic revert does not
      // capture them — they are killed explicitly here instead.
      return () => {
        disposed = true;
        rafs.forEach((id) => cancelAnimationFrame(id));
        tl?.kill();
        split?.revert();
        // Drop the back-reference too, so a later build re-entering this node
        // does not revert an instance GSAP has already discarded.
        if (trackedTitle) delete trackedTitle.__skHeroSplit;
      };
    },
    { scope: pageRef },
  );

  const faqSchema = getFAQSchema(generalFaqs);

  return (
    <main id="main-content" ref={pageRef} className="min-h-screen bg-background text-foreground">
      <StructuredData
        data={[
          faqSchema,
          getWebPageSchema({
            path: "/",
            name: "Skédio — UI/UX Design, Identity & Digital Studio",
            description: siteConfig.description,
          }),
        ]}
      />

      {/* Nav */}
      <SiteHeader
        links={[
          { label: "Work", to: "/projects" },
          { label: "Services", to: "/services" },
          { label: "Blog", to: "/blog" },
          { label: "About", to: "/about" },
        ]}
      />

      {/* Hero — a sticky stage inside a tall scroll track.

          `heroPrefersReducedMotion` gates this: a reduced-motion visitor gets a
          plain, non-pinned hero of natural height and the poster only. Pinning
          is not itself an animation, but a stage that holds the viewport while
          the visitor scrolls IS scroll-driven motion, which is exactly what
          that preference is asking us not to impose. Reading it from a
          matchMedia object rather than at render keeps the server markup and the
          first client render identical. */}
      <section
        ref={heroTrackRef}
        data-hero-track={heroPrefersReducedMotion ? undefined : ""}
        className="relative"
        style={heroPrefersReducedMotion ? undefined : { height: `${HERO_TRACK_VH}vh` }}
      >
        <div
          data-hero-stage={heroPhase}
          className={
            heroPrefersReducedMotion
              ? "mx-auto w-full max-w-[1440px] px-6 pt-8 pb-0 md:px-12 md:pt-24 lg:pt-28"
              : "sticky top-0 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-center px-6 pt-8 pb-8 md:px-12 md:pt-24 lg:pt-28"
          }
        >
          <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-5 lg:gap-10">
            {/* Left column (~60%) */}
            <div className="lg:col-span-3">
              {/* Wraps naturally at display size — no <br />, the browser's own
                break is correct here. The space before the accent span is a real
                text-node space: keep it on this line, because a reflow that moved
                the span onto its own line would trim it and render
                "WhereBrands Begin." to Googlebot's H1 extraction, screen readers
                and social scrapers. There is exactly one .sk-hero-accent, since
                the entrance timeline queries it with a singular selector. */}
              <h1 className="type-h1 sk-hero-start sk-hero-title">
                A Creative Design Studio Where <span className="sk-hero-accent">Brands Begin.</span>
              </h1>

              <p
                data-hero-lede=""
                className="sk-hero-start mt-6 text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                From brand identity and UI/UX design to MVP development, <br />
                we help founders take products from idea to launch.
              </p>

              {/* Driven straight off servicesData, so a service added there
                appears here without touching this file. The row deliberately
                stays `flex-wrap` at every width instead of forcing
                `sm:flex-nowrap`: each pill is `whitespace-nowrap`, so a
                nowrap row cannot wrap and silently pushes the last pill past
                the viewport edge. With four services the row needs 549px of a
                592px box at the 640px breakpoint -- 43px of slack, measured --
                so one longer service name or a fifth service would overflow
                rather than wrap. Wrapping costs nothing at the widths where the
                pills already fit on one line. */}
              <div className="mt-10 flex flex-wrap items-center gap-2">
                {servicesData.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    data-hero-pill=""
                    className="sk-hero-start whitespace-nowrap rounded-md border border-border bg-surface px-4 py-1.5 text-sm font-medium leading-tight text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary sm:px-3 sm:text-[0.8125rem] lg:px-2.5"
                  >
                    {s.shortTitle}
                  </Link>
                ))}
              </div>

              <div data-hero-cta className="sk-hero-start mt-8 flex items-center gap-2 md:gap-3">
                <PillLink href="#work" variant="ink">
                  View our works
                </PillLink>
                <PillLink onClick={openContactModal} variant="outline">
                  Let's Talk
                </PillLink>
              </div>

              <p
                data-hero-proof
                className="sk-hero-start mt-8 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Zap className="size-4 text-primary" />
                {`Get a reply within ${siteConfig.responseTime}`}
              </p>
            </div>

            {/* Right column (~40%, lower) — partner card only on desktop */}
            <div data-hero-partner className="sk-hero-start hidden lg:col-span-2 lg:block">
              <div className="rounded-2xl border border-border bg-surface/60 p-8 lg:p-10">
                <p className="eyebrow text-center">Partner with</p>
                <div className="sk-marquee mt-6 overflow-hidden">
                  <div className="sk-marquee-track flex w-max items-center">
                    {marqueeLogos.map((item, i) => (
                      <div
                        key={`${item.id}-${i}`}
                        aria-hidden={item.isRepeat ? "true" : undefined}
                        className="flex h-40 w-52 shrink-0 items-center justify-center"
                      >
                        {"img" in item && item.img ? (
                          <WebpImage
                            src={item.img}
                            srcSet={item.imgSrcSet}
                            webpSrcSet={item.webpSrcSet}
                            sizes={PARTNER_LOGO_SIZES}
                            alt={item.isRepeat ? "" : item.label}
                            width={320}
                            height={320}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                          />
                        ) : (
                          <span className="whitespace-nowrap text-center font-display text-4xl font-bold tracking-tight text-foreground/50 transition-colors duration-300 hover:text-foreground">
                            {item.label}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero visual (LCP) — deliberately NOT .sk-hero-start: it must be
            opacity:1 on first paint and never wait for GSAP. Entrance motion
            is transform-only (see useGSAP) with immediateRender:false.
            Responsive width candidates: the visual is full-bleed inside a
            max-w-1440 container (px-6 mobile / md:px-12 desktop), so mobile
            sizes track 100vw minus padding and desktop tracks the container
            width. 1280w covers the ~1244px rendered desktop width at 1x;
            1440w remains for high-DPR desktop. Never lazy-load (LCP). */}
          <div data-hero-visual className="relative mt-10 lg:mt-24">
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet={`${hero768Avif} 768w, ${hero1024Avif} 1024w, ${hero1280Avif} 1280w, ${heroDesktopAvif} 1440w`}
                sizes={HERO_DESKTOP_SIZES}
                type="image/avif"
              />
              <source
                media="(min-width: 1024px)"
                srcSet={`${hero768Webp} 768w, ${hero1024Webp} 1024w, ${hero1280Webp} 1280w, ${heroDesktopWebp} 1440w`}
                sizes={HERO_DESKTOP_SIZES}
                type="image/webp"
              />
              <source
                srcSet={`${heroMobile480Avif} 480w, ${heroMobileAvif} 720w`}
                sizes={HERO_MOBILE_SIZES}
                type="image/avif"
              />
              <source
                srcSet={`${heroMobile480Webp} 480w, ${heroMobileWebp} 720w`}
                sizes={HERO_MOBILE_SIZES}
                type="image/webp"
              />
              <img
                src={heroFallback}
                srcSet={`${heroFallback768} 768w, ${heroFallback1024} 1024w, ${heroFallback1280} 1280w, ${heroFallback} 1440w`}
                /* This <img> is the no-<picture> fallback, so its srcset holds only
                 the desktop JPEGs — hence HERO_DESKTOP_SIZES rather than the old
                 two-branch form whose mobile branch (`calc(100vw - 48px)`)
                 described assets that are not in this srcset at all. */
                sizes={HERO_DESKTOP_SIZES}
                alt="Skédio design studio hero showcase — bold brand identity and UI/UX design"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                width={1440}
                height={810}
                className="aspect-[16/9] w-full rounded-2xl object-cover"
              />
            </picture>

            {/* Video overlays the picture rather than replacing it. The <picture>
              stays mounted underneath as three things at once: the LCP
              candidate (a 1.1MB video would paint far later than the avif and
              would regress the metric this hero is built to protect), the frame
              shown before the first video frame decodes, and the permanent
              fallback when playback is refused or the codec is unsupported.
              inset-0 + object-cover keeps it locked to the picture's 16:9 box. */}
            <video
              ref={heroVideoRef}
              src="/video/hero.mp4"
              muted={heroMuted}
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              onEnded={() => {
                // Reduced motion gets the poster layer and nothing else, so the
                // sequence never starts. `ended` only fires in the browser, so
                // touching window here is safe.
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                // Record it in a ref as well as state: the scroll evaluator reads
                // this synchronously on every frame, and a state write would only
                // be visible to it after a re-render. The setState below is what
                // makes the scroll handler re-evaluate and release the logos.
                videoEndedRef.current = true;
                setHeroEndedTick((t) => t + 1);
              }}
              className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover"
            />

            {/* Beat 2 — client logos, centre stage, then shrunk to a bottom strip
              and left there. Mounted only after the video ends. alt is empty
              because no client in `clients` has a realName yet, which is the
              same signal Clients.tsx uses to treat them as decorative. */}
            {heroPhase !== "video" && (
              <div
                data-hero-logos=""
                className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex origin-bottom flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 pb-3 opacity-0"
              >
                {clients.map((client) => (
                  <img
                    key={client.name}
                    data-hero-client=""
                    src={client.logo}
                    alt=""
                    width={client.width}
                    height={client.height}
                    loading="lazy"
                    decoding="async"
                    className="h-6 w-auto object-contain opacity-60 grayscale md:h-7"
                  />
                ))}
              </div>
            )}

            {/* Beat 3 — the work, as a flush collage. A 4-column CSS grid with
              four 1fr rows, the final row's two cards each spanning two columns
              so the rectangle closes with no holes. No absolute positioning and
              no rotation: a grid is tidy by construction, which is also why
              nothing here can drift between server and client. Mounted late so
              14 requests never touch initial load.

              `h-full` on the cards is load-bearing, not tidying. The sources are
              NOT uniform — a mix of 16:9, 1:1 and 2:3 portrait — and an <img>
              that is only `w-full` resolves to width:100%; height:auto, i.e.
              its own intrinsic aspect ratio. `object-fit: cover` then has no box
              height to crop into, so it does nothing: 9 of the 14 cards rendered
              TALLER than their 1fr row (a 1:1 shot became 333px in a 186px row),
              spilled over the rows below, and pushed the collage to 1030px
              inside a 756px frame where overflow-hidden guillotined the last 274px.
              Worse, those heights came from each image's intrinsic size, so the
              grid re-flowed as the bytes arrived — the whole collage visibly
              jumped into place, worst at the top-left card with nothing over it.
              `h-full` makes every card fill its row so cover actually crops to a
              uniform 16:9 cell, which fixes the overlap, the clipping and the
              load-time reflow in one declaration. */}
            {collageMounted && (
              <div
                data-collage-layer=""
                className="pointer-events-none absolute inset-0 z-10 grid grid-rows-4 overflow-hidden p-1.5"
                style={{
                  gridTemplateColumns: `repeat(${COLLAGE_COLUMNS}, minmax(0, 1fr))`,
                }}
              >
                {heroCollageImages.map((src, i) => (
                  <img
                    key={src}
                    data-collage-card=""
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={spansTwoColumns(i) ? { gridColumn: "span 2" } : undefined}
                    className="h-full min-h-0 w-full rounded-lg object-cover opacity-0 shadow-lg"
                  />
                ))}
              </div>
            )}

            {/* Beat 4 — each mockup full-frame, one at a time, slow crossfade.
              Stacked and faded by index rather than swapped, so consecutive
              slides overlap instead of cutting through black. Only the active
              slide carries `loading="eager"`: the rest are already cached from
              the collage beat and re-fetching them would defeat that. */}
            {slideIndex !== null && (
              <div data-slideshow-layer="" className="pointer-events-none absolute inset-0 z-20">
                {heroCollageImages.map((src, i) => (
                  <img
                    key={src}
                    data-slide=""
                    data-active={i === slideIndex ? "true" : undefined}
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000 ease-in-out data-[active=true]:opacity-100"
                  />
                ))}
              </div>
            )}

            {/* The only control: audio. No `controls` attribute, no scrubber, no
              playback chrome — a native control bar over a decorative hero
              video is both visually wrong and unusable at this size. */}
            <button
              type="button"
              onClick={() => setHeroMuted((m) => !m)}
              aria-label={heroMuted ? "Unmute hero video" : "Mute hero video"}
              aria-pressed={!heroMuted}
              className="absolute right-3 bottom-3 grid size-10 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-colors duration-250 ease-out hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {heroMuted ? (
                <VolumeX className="size-4" aria-hidden="true" />
              ) : (
                <Volume2 className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Responsive: bare logo marquee below the copy (no card, no label) */}
          <div className="mt-10 lg:hidden">
            <div className="sk-marquee overflow-hidden">
              <div className="sk-marquee-track flex w-max items-center">
                {marqueeLogos.map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    aria-hidden={item.isRepeat ? "true" : undefined}
                    className="flex h-auto shrink-0 items-center justify-center px-8 py-2"
                  >
                    {"img" in item && item.img ? (
                      <WebpImage
                        src={item.img}
                        srcSet={item.imgSrcSet}
                        webpSrcSet={item.webpSrcSet}
                        sizes={PARTNER_LOGO_SIZES}
                        alt={item.isRepeat ? "" : item.label}
                        width={320}
                        height={320}
                        loading="lazy"
                        decoding="async"
                        className="h-32 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <span className="whitespace-nowrap font-display text-3xl font-bold tracking-tight text-foreground/50 transition-colors duration-300 hover:text-foreground">
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-background">
        {/* Services */}
        <WhatWeDo />

        {/* Work */}
        <SelectedWork />

        {/* Articles */}
        <BlogPreview />

        {/* Clients */}
        <Clients />

        {/* Testimonials */}
        <Testimonials />

        {/* FAQs Section (High-Leverage AEO Surface) */}
        <section
          id="faqs"
          className="mx-auto w-full max-w-[900px] scroll-mt-24 px-6 pb-20 lg:pb-24"
        >
          <ScrollReveal>
            <div className="text-center">
              <p className="eyebrow">Studio FAQs</p>
              <h2 className="type-h2 mt-4 font-extrabold">Questions you might have</h2>
              <p className="mt-3 text-muted-foreground">
                Clear answers on pricing, timelines, deliverables, and how we work with founders.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 space-y-4">
            {generalFaqs.map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index % 3}>
                {/* `hidden` (display:none) rather than `sr-only` + aria-hidden:
                    sr-only clips to 1x1px but stays focusable, which put seven
                    invisible FAQ buttons in the tab order while announcing
                    aria-hidden="true". `hidden` drops them from the a11y tree,
                    the tab order, and layout, and still avoids remounting. */}
                <div hidden={!showMore && index >= 4}>
                  <FaqItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaq === index}
                    onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>

          {generalFaqs.length > 4 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-primary hover:underline transition-colors"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
