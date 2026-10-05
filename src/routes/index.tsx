import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Zap } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import carouselPlates from "virtual:carousel-manifest";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactModal } from "@/context/use-contact-modal";
import { loadScrollTrigger } from "@/lib/animation-loader";
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
import { clients } from "@/data/clients";
import { responsiveFor } from "@/lib/responsive-images";
import { servicesData } from "@/data/services";
import { homepageFaqs } from "@/data/faq";

// Route-scoped serif — see src/fraunces.css and the head() note below.
import frauncesCss from "@/fraunces.css?url";

gsap.registerPlugin(SplitText);

/* ---------------------------------------------------------------------------
 * Hero beat two — once the film finishes, the word "Clients" types itself into
 * the middle of the frame and the client logos bloom outward around it.
 *
 * The positions are hand-placed, not computed. An ellipse was the obvious
 * choice and it was wrong twice over: on a 2.39:1 frame the arc step per 30deg
 * slot is RX*dTheta at 12 and 6 o'clock but RY*dTheta at 3 and 9 — 286px vs
 * 107px on a 1440px-wide frame, so the logos bunched at the poles and strung
 * out at the sides. And any radial layout reads as a clock face, which is the
 * one thing scattered logos must not do.
 *
 * A table also buys the keep-out that a formula could not express: every entry
 * sits outside x 38.5-61.5%, y 41.5-58.5%, which is the "Clients" word's own
 * bounding box at its worst ratio (the word caps at 4rem, so its share of the
 * frame peaks near a ~1185px viewport, not at the 1440px max-width). Entries
 * are clear of that box by at least 5% of frame width in one axis, and of the
 * frame edges by ~7%, and no two logos' boxes overlap at any viewport.
 *
 * The frame's aspect ratio is locked, so one table serves every width: a
 * percentage of width and a percentage of height always describe the same
 * physical distance, and the whole layout scales as one piece.
 *
 * `scale` varies ink height per logo to give the scatter depth. It is capped so the
 * widest mark (929x205, 4.53:1) still renders under 240px at 1440 — that keeps
 * every logo inside the 480w candidate in responsive-images.ts at 2x DPR.
 *
 * SIZING IS BY INK, NOT BY CANVAS. Every /Clients/*.png is a 1080x1080 square
 * canvas with the mark centred inside it and transparent padding around it, and
 * the padding is not uniform: ink fills 77% of the canvas height for Client 12
 * but only 19% for Client 04. Sizing the box by canvas height therefore rendered
 * visible marks between 1.9% and 7.7% of the frame height — a 4x spread that
 * reads as "some of the logos are broken". `client.width`/`client.height` are
 * the INK box, so dividing the target by `client.height / canvas` gives every
 * logo the same visible height and lets `scale` be the only variable.
 *
 * Because the ink is centred, the visible mark inside the box is
 * `height * (inkHeight / canvas)` tall and `height * (inkWidth / canvas)` wide,
 * anchored on the slot point. Collision checks have to use those ink rects: at
 * equal ink height the boxes themselves overlap heavily, because the box of the
 * 4.53:1 mark is nearly as wide as it is tall while its ink is a thin sliver.
 */
const CLIENT_LOGO_CANVAS = 1080;

/** Visible (ink) height of a scale-1.0 logo, as a percentage of frame height. */
const HERO_LOGO_INK_PCT = 8;

/**
 * Hero mockup beat. The sequence is whatever `public/carousel/` contains, read at
 * build time by the `skedio:carousel-manifest` plugin in vite.config.ts — drop in
 * `m4.webp` and the cycle grows a fourth beat, no code change.
 *
 * The `m` prefix is the filter. That folder also holds the older numbered plates
 * (`1.png` … `13.png`) from the previous collage, and the anchored pattern keeps
 * them out instead of splicing twelve retired images into the hero.
 *
 * These are full-bleed 2.39:1 exports — `m1.webp` is 1920x803 against the
 * frame's 239/100 — so `object-cover` is an exact fit here rather than the 26%
 * vertical crop it was for the previous hand-picked sources. It is kept anyway:
 * it is what makes a mis-sized future plate fill the frame instead of
 * letterboxing, which is the failure that would actually be visible.
 *
 * No `width`/`height` attributes, unlike the rest of the page's imagery. Every
 * plate is `absolute inset-0` and sized in CSS, so nothing about its intrinsic
 * ratio can affect layout, and reading dimensions at config time would mean
 * pulling sharp into the config for no layout benefit. One request each, all
 * lazy, and none of them is a candidate for LCP — the earliest is reachable at
 * ~7s into the cycle.
 */
const HERO_MOCKUPS: string[] = carouselPlates;

/* ---------------------------------------------------------------------------
 * Hero cycle timings, in seconds.
 *
 * HERO_MOCKUP_HOLD_S is the gap between one plate starting and the next, NOT the
 * time a plate is actually readable: each transition crossfades over
 * HERO_MOCKUP_CROSSFADE_S, so full-opacity dwell is hold - crossfade. At the
 * 1.5s / 0.55s this started on, that left each plate fully visible for 0.95s —
 * six of them back to back read as a flipbook rather than a showcase. 2.8s puts
 * it at 2.25s of readable dwell per plate.
 *
 * One lap is film (3.6) + clients (3.4) + one beat per plate, so the lap grows
 * with the folder: ~22s at the six plates currently in public/carousel/.
 * ------------------------------------------------------------------------- */
const HERO_FILM_HOLD_S = 3.6;
const HERO_CLIENTS_HOLD_S = 3.4;
const HERO_MOCKUP_HOLD_S = 2.8;
const HERO_MOCKUP_CROSSFADE_S = 0.55;

interface HeroLogoSlot {
  x: number;
  y: number;
  scale: number;
}

const HERO_LOGO_SLOTS: HeroLogoSlot[] = [
  { x: 14.5, y: 25, scale: 0.86 },
  { x: 25, y: 63, scale: 1.12 },
  { x: 30, y: 14.5, scale: 0.94 },
  { x: 39, y: 30.5, scale: 0.88 },
  // Second-smallest by area at 1.0, for the same reason Client 12 was: 1.12:1 is
  // all but square, so a shared ink height leaves it covering a fraction of the
  // area of the wordmarks. 1.2 puts it at 0.43 against a 0.66 median.
  { x: 45, y: 79, scale: 1.2 },
  { x: 57, y: 17.5, scale: 1.18 },
  // y 72, not 70.5: at 1.0 the ink is 8% of frame height and on a 320px phone
  // the word itself is 24.6% of frame height, so 70.5 left under 4% of frame
  // height between them. Dropping the slot buys the clearance the bigger ink
  // needed. 0.82 -> 1.0 moves it from 0.47 to 0.70, level with the median.
  { x: 66, y: 72, scale: 1.0 },
  { x: 78, y: 27, scale: 1.06 },
  { x: 85.5, y: 58, scale: 0.9 },
  { x: 83, y: 14, scale: 1.15 },
  // 1.45, up from the 0.8 the spread started at. Equal ink HEIGHT is the wrong
  // target for a square mark sitting among wordmarks: Client 12 is the only 1:1
  // logo, so at a shared height it covers a quarter of the area of the 4.53:1
  // Client 04. At 0.8 it was the smallest thing on screen (0.17 of a 0.66 median
  // of inkW% x inkH%); at 1.45 its ink is 11.6% of frame height by 4.9% of frame
  // width, which is 0.56 — just under median, and clearly no longer an outlier.
  //
  // The slot stays in the bottom-right corner. Anything much past this runs the box
  // into Client 07's ink, because the box is square and grows with the ink: 2.7
  // was the point where the two collided, so a bigger mark for this logo wants
  // the empty bottom-centre at (57, 82), not a bigger number on this slot.
  //
  // x is not 88: the box is wider at this size, so 87.6 is what keeps its right
  // edge on Client 10's, the other logo out at the right (85.5 + 5.2 = 90.7
  // against 87.6 + 3.2 = 90.7). The two marks share a margin instead of both
  // floating near the corner at different distances from it. Client 10's ink is
  // 20% of frame height higher, so the shared edge is a margin and not a stack.
  { x: 87.6, y: 87, scale: 1.45 },
  { x: 16, y: 87.5, scale: 1.02 },
];

/**
 * Clients paired with their slot and the box height that yields their target ink
 * height. `flatMap` so a client added to `clients.ts` with no entry here is
 * simply absent from the hero scatter — indexing straight into the table would
 * park it at 0%,0% in the top-left corner instead.
 */
const heroLogoSlots = clients.flatMap((client, i) => {
  const slot = HERO_LOGO_SLOTS[i];
  if (!slot) return [];
  const inkHeightFraction = client.height / CLIENT_LOGO_CANVAS;
  return [
    {
      client,
      slot,
      boxHeightPct: (HERO_LOGO_INK_PCT * slot.scale) / inkHeightFraction,
    },
  ];
});

/**
 * Injects the route-scoped serif stylesheet (see src/fraunces.css).
 * `fetchPriority` is a no-op on browsers that don't support it, which is
 * fine — the link being async is what keeps it off the blocking path.
 */
const loadFrauncesAsync =
  `(function(){try{var l=document.createElement("link");l.rel="stylesheet";` +
  `l.href=${JSON.stringify(frauncesCss)};l.fetchPriority="low";` +
  `document.head.appendChild(l)}catch(e){}})()`;

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
      // No hero-image preload: the visual box is empty, so preloading one
      // would fetch ~100KB that nothing ever renders.
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
  const heroWordRef = useRef<HTMLParagraphElement>(null);
  const heroScatterRef = useRef<HTMLDivElement>(null);
  const heroMockupRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------------------
   * Hero cycle — film, then clients, then mockups, then round again, forever.
   *
   * This is a fixed-duration repeating timeline rather than a ladder of media
   * events, and that is a deliberate inversion of the one-shot version it
   * replaces. That version had to latch on whichever of `ended` / `error` /
   * `loadedmetadata` / a `play()` rejection / a 12s ceiling arrived first,
   * because it needed to know when the film was really over. Nothing here needs
   * to know that: the film is cut at a fixed time whatever the asset's real
   * duration is, so the timeline can simply advance. Every stall the old ladder
   * existed to survive becomes a non-event — a video that 404s, a codec the
   * browser refuses, autoplay rejected because the visitor is on a data saver —
   * all of them just leave an empty grey frame for the first beat while the rest
   * of the cycle keeps its rhythm. A stall-proof sequence that still stops dead
   * on a stall is strictly worse than a timed one that cannot.
   *
   * SplitText is built ONCE, up front, rather than inside the beat. The timeline
   * repeats, so a per-cycle split would re-split already-split characters on
   * every lap.
   * ------------------------------------------------------------------------- */
  useEffect(() => {
    const video = heroVideoRef.current;
    const word = heroWordRef.current;
    const scatter = heroScatterRef.current;
    const mockupLayer = heroMockupRef.current;
    if (!video || !word || !scatter || !mockupLayer) return;

    const logos = scatter.querySelectorAll<HTMLElement>(".sk-hero-client-logo");
    const mockups = mockupLayer.querySelectorAll<HTMLElement>(".sk-hero-mockup");

    // Reduced motion gets the finished clients composition and nothing more: no
    // film, no typing, no bloom, and above all no cycle. A 12.2s loop that never
    // stops is the most motion-hostile thing this page could contain, and the
    // mockup beat in particular has no non-moving equivalent worth degrading to.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      gsap.set(video, { opacity: 0 });
      gsap.set(word, { opacity: 1 });
      gsap.set(logos, { opacity: 1 });
      return;
    }

    // Stashed on the node so a re-entry reverts any split still attached rather
    // than layering a second set of character spans over the first.
    type WordSplit = ReturnType<typeof SplitText.create>;
    const tracked = word as HTMLParagraphElement & { __skClientsSplit?: WordSplit };
    tracked.__skClientsSplit?.revert();
    const split = SplitText.create(word, { type: "chars" });
    tracked.__skClientsSplit = split;

    // Absolute positions within one lap, in seconds.
    const type = HERO_FILM_HOLD_S + 0.45;
    const wordEnd = type + 0.5 + split.chars.length * 0.055;
    const dissolve = HERO_FILM_HOLD_S + HERO_CLIENTS_HOLD_S;
    const lapEnd = dissolve + mockups.length * HERO_MOCKUP_HOLD_S + 0.7;

    const startFilm = () => {
      // Rewind every lap, not just when `video.ended`: the film is cut short at
      // HERO_FILM_HOLD_S so it never reaches its own end, and would otherwise
      // resume from 3.6s on the next pass and show a frozen frame.
      video.currentTime = 0;
      void video.play().catch(() => {});
    };

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power3.out" } });

    // 0. Each lap opens by fading the film up from the mockup before it. Without
    //    this the wrap-around is a hard cut, which on a sequence this hypnotic
    //    reads as a glitch rather than a loop.
    tl.call(startFilm, undefined, 0).fromTo(
      video,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: "power2.out" },
      0,
    );

    // 1. The film. Cut and faded rather than waited out, which is what pins the
    //    lap length: the asset is 8s and the beat is 3.6s, so the last 4.4s of
    //    footage are never shown and the cycle stays snappy.
    tl.to(video, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, HERO_FILM_HOLD_S).call(
      () => video.pause(),
      undefined,
      HERO_FILM_HOLD_S + 0.8,
    );

    // 2. "Clients" types itself in. Each character resolves out of a blur while
    //    a chromatic split closes behind it — that closing gap is the motion
    //    trail. Overlapping the fade-out by 0.45s keeps the two beats from
    //    reading as a hard cut.
    tl.set(word, { opacity: 1 }, type)
      .fromTo(
        split.chars,
        {
          opacity: 0,
          x: 14,
          yPercent: -30,
          filter: "blur(12px)",
          textShadow: "0.07em 0 #00e5ff, -0.07em 0 #ff2d95",
        },
        {
          opacity: 1,
          x: 0,
          yPercent: 0,
          filter: "blur(0px)",
          textShadow: "0 0 rgba(0,0,0,0)",
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.055,
        },
        type,
      )
      .fromTo(
        word,
        { y: 12, scale: 1.04 },
        { y: 0, scale: 1, duration: 0.9, ease: "power2.out" },
        type,
      );

    // 3. The scatter blooms. `from: "center"` works outward from the middle of
    //    the list, so the logos land near the word first and the outer ones last.
    tl.fromTo(
      logos,
      { opacity: 0, scale: 0.5, filter: "blur(10px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: { each: 0.055, from: "center" },
      },
      wordEnd,
    );

    // 4. Dissolve. Blur and fade together, at the same time the first mockup
    //    starts underneath, so the swap is covered rather than sequential.
    tl.to(
      [word, ...logos],
      { opacity: 0, filter: "blur(12px)", duration: 0.7, ease: "power2.in" },
      dissolve,
    );

    // 5. Mockups, crossfading. The first scales down into place; the rest are
    //    straight dissolves so the sequence reads as one rhythm rather than
    //    three separate entrances. `previous` is carried across iterations
    //    instead of indexing back into the NodeList, which is typed as possibly
    //    empty per lookup and would need a guard that can never actually fail.
    let previous: HTMLElement | undefined;
    mockups.forEach((mockup, i) => {
      const at = dissolve + i * HERO_MOCKUP_HOLD_S;
      if (i === 0) {
        tl.fromTo(
          mockup,
          { opacity: 0, scale: 1.06 },
          // `immediateRender: false` is load-bearing. A `fromTo` renders its
          // from-state the moment the timeline is built rather than when the
          // tween's turn arrives, which parked the first mockup at scale 1.06 for
          // its entire invisible life: 6% wider than the frame on every side,
          // showing at a different zoom from the other two that carry no scale,
          // and inflating the frame's scrollWidth by 40px.
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", immediateRender: false },
          at,
        );
      } else if (previous) {
        tl.to(
          previous,
          { opacity: 0, duration: HERO_MOCKUP_CROSSFADE_S, ease: "power2.inOut" },
          at,
        ).fromTo(
          mockup,
          { opacity: 0 },
          { opacity: 1, duration: HERO_MOCKUP_CROSSFADE_S, ease: "power2.inOut" },
          at,
        );
      }
      previous = mockup;
    });

    // 6. Arm the next lap. `clearProps` on filter is required, not tidiness: the
    //    dissolve leaves blur(12px) on these nodes, and the next lap's word/logos
    //    tweens never set filter back to 0 on the ones they do not touch — the
    //    logos tween does, but `word` itself only ever gets `y`/`scale`, so
    //    without this the word would enter every lap permanently out of focus.
    tl.set([word, ...logos], { opacity: 0, clearProps: "filter" }, lapEnd).set(
      mockups,
      { opacity: 0 },
      lapEnd,
    );

    return () => {
      tl.kill();
      video.pause();
      split.revert();
      delete tracked.__skClientsSplit;
    };
  }, []);

  // How many animation frames to wait before building the entrance.
  // `useGSAP` runs in a layout effect, i.e. BEFORE the browser paints the
  // hydrated tree, and SplitText.create() measures the heading to find word
  // boundaries. Doing that measurement there means a forced synchronous layout
  // inside the hydration commit. Two nested rAFs push the whole setup past the
  // first paint frame — the hero copy is on screen before the animation runs.
  // The cost is ~2 frames (~32ms) of delay on a state that is already invisible.
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

        // Only non-LCP hero chrome participates in the entrance. The visual
        // box is empty and is not animated at all.
        const reveals = Array.from(
          root.querySelectorAll<HTMLElement>(
            "[data-hero-lede], [data-hero-pill], [data-hero-cta], [data-hero-proof], [data-hero-partner]",
          ),
        );

        // READS BEFORE WRITES. The querySelector above and the Split() call
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
      // Deferred rather than immediate, so the first paint is never competing
      // with GSAP building the timeline and SplitText measuring the heading.
      rafs.push(requestAnimationFrame(step));

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

  // Built from `homepageFaqs`, not `generalFaqs`. Marking up questions that are
  // not on this page is a guideline violation, and it is the kind that gets a
  // site a manual action rather than a rich result, so the schema has to be
  // driven by the same array the accordion renders.
  const faqSchema = getFAQSchema(homepageFaqs);

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

      {/* Hero — copy plus an empty visual box.

          The scroll-driven sequence that used to live here (a pinned 150vh stage
          cycling video → logos → collage → slideshow) has been removed, so the
          section is an ordinary document-flow hero again: no track, no sticky
          pinning, no stage state. The visual box below is kept as an empty
          fixed-ratio placeholder. */}
      <section className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-0 md:px-12 md:pt-24 lg:pt-28">
        <div className="flex flex-col justify-center">
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
              on screen before the entrance runs, so it is never gated behind it.

              The video is NOT looped: `ended` is what triggers the beat below,
              and a looping element never fires it. When it does finish, the film
              fades out, "Clients" types into the middle of the frame, and the
              client logos bloom outward around it.

              `aria-hidden` sits on the <video> and on the logo scatter only. The
              word between them is the one piece of real copy in this box, so
              hiding the wrapper would hide it from assistive tech.

              2.39:1 (anamorphic scope) is kept: full width at a cinematic ratio.
              `object-cover` is load-bearing — the file is not 2.39:1, so without
              it the video letterboxes inside the frame instead of filling it.
              `bg-muted` (a flat grey) is what the word and the logos read
              against once the film is gone. */}
          <div
            data-hero-visual=""
            className="relative mt-10 aspect-[239/100] w-full overflow-hidden rounded-2xl bg-muted lg:mt-24"
          >
            <video
              ref={heroVideoRef}
              src="/video/hero.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover"
            />

            {/* Mockup beat, the last third of the cycle. Sits between the film
                and the word in paint order so it covers the video while it is up
                and is covered by the word once the film comes round again —
                neither ever needs an explicit z-index.

                Entirely decorative: `aria-hidden` rather than an alt on each, and
                `lazy` because nothing here is reachable until ~7s in, long after
                LCP has been picked by the heading. */}
            <div
              ref={heroMockupRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              {HERO_MOCKUPS.map((src) => (
                <WebpImage
                  key={src}
                  src={src}
                  sizes="(max-width: 1440px) 92vw, 1344px"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="sk-hero-mockup absolute inset-0 h-full w-full object-cover"
                />
              ))}
            </div>

            {/* The word the scatter opens around. SplitText owns the inner markup
                from here, so the word is one text node and stays one string for
                screen readers (`aria: "auto"` keeps an aria-label on the line
                and hides the per-character spans). */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
              <p
                ref={heroWordRef}
                data-hero-clients-word=""
                className="sk-hero-clients-word m-0 text-center font-display text-[clamp(1.75rem,5.4vw,4rem)] font-extrabold leading-none tracking-tight text-foreground"
              >
                Clients
              </p>
            </div>

            {/* The scatter. Every logo is decorative: no client in `clients` has a
                `realName` we are cleared to publish, so an alt text would only
                leak "Client 07" into the accessibility tree — the same signal
                Clients.tsx uses to treat them as decorative.

                The wrapper div carries the centring translate precisely so GSAP
                is free to own the <img>'s transform: animating both at once
                would mean the entrance scale fighting the -50%/-50% offset.

                `height` is a percentage of the frame, not a viewport unit, and
                that is load-bearing twice over. It is the only way the logos stay
                proportional to a box that is 3.9x wider on desktop than on a
                phone (a `clamp()` floor big enough to read on a 143px-tall
                mobile frame is 14% of its height, versus 9% at 1440px — the
                scatter visibly changes weight with viewport). And it resolves at
                all only because this div is absolutely positioned: a percentage
                height against a content-sized parent computes to `auto`, which
                would drop each logo back to its intrinsic 1080px.

                The width/height attributes are the 1080x1080 canvas, not
                client.width/height (which is the ink box) — the attributes
                reserve layout space, so they have to describe the resource the
                browser actually loads. Declaring the ink ratio instead made the
                box reflow from 1.22:1 to 1:1 the moment the image decoded.

                The shadow lives on this div, not the <img>, because the beat
                below writes `filter: blur()` straight onto every
                `.sk-hero-client-logo`. Two elements means two separate filter
                properties, so GSAP's blur and the drop-shadow coexist instead of
                the tween's final `blur(0px)` erasing the shadow. */}
            <div
              ref={heroScatterRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              {heroLogoSlots.map(({ client, slot, boxHeightPct }) => {
                const logo = responsiveFor(client.logo);
                return (
                  <div
                    key={client.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_5px_rgba(0,0,0,0.2)]"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      height: `${boxHeightPct}%`,
                    }}
                  >
                    <WebpImage
                      src={logo.src}
                      srcSet={logo.srcSet}
                      webpSrcSet={logo.webpSrcSet}
                      sizes="(max-width: 640px) 80px, 260px"
                      width={CLIENT_LOGO_CANVAS}
                      height={CLIENT_LOGO_CANVAS}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="sk-hero-client-logo h-full w-auto object-contain grayscale"
                    />
                  </div>
                );
              })}
            </div>

            {/* Frosted glass along the top and bottom edges. Last in paint order
                so the backdrop-filter actually has something to sample — a
                band placed before the video would blur the flat `bg-muted` and
                read as a grey smear. `pointer-events-none` because the film
                beneath is the thing being watched, and `aria-hidden` because a
                decorative edge treatment is not content.

                The blur is faded out with `mask-image` rather than by ending
                the element with a transparent background. Those look similar
                and are not: a background gradient only softens the tint and
                leaves a hard rectangle where the blur stops, which is the tell
                that gives fake glassmorphism away. Masking the element itself
                fades the backdrop-filter along with the fill, so the band has no
                edge. `-webkit-mask-image` is spelled out because Tailwind's
                arbitrary-property syntax cannot add the prefix, and Safari needs
                it to mask at all.

                Cost note: backdrop-filter over a playing <video> forces a
                backdrop readback every frame, and that is the one thing in this
                frame that can cost real frame rate. It is bounded to the film
                beat, though — the clients composition and the mockup plates are
                static, so the browser caches their backdrop and recomposites
                only the band. If it needs to be cheaper, `backdrop-blur-xl`
                (24px) over `2xl` (40px) is the first dial to turn.

                Below `sm` none of the four are rendered at all, which is what
                removes the per-frame readback rather than merely softening it.
                The frame is 239:1, so an h-24 band is a third of a 268px-tall
                phone frame against ~9% of the 1440px desktop one — the effect
                is at its heaviest exactly where there is least frame rate to
                spend, and a 40px blur at that size reads as haze, not glass.
                `display: none` also means the compositor never allocates the
                filter surface, which a reduced-opacity backdrop-filter would. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 hidden h-24 bg-white/12 backdrop-blur-2xl backdrop-saturate-150 sm:block [mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_100%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-24 bg-white/12 backdrop-blur-2xl backdrop-saturate-150 sm:block [mask-image:linear-gradient(to_top,#000_0%,#000_30%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,#000_0%,#000_30%,transparent_100%)]"
            />
            {/* The lit lip. A single hairline along each outer edge, brightest
                where it meets the corner radius. Blur plus translucency on its
                own reads as frosted haze; it is the highlight that reads as a
                physical pane, so it is the difference between the two being
                told apart. `rounded-2xl` on the frame means these are clipped to
                the same corner curve rather than squaring it off.

                Same `sm:block` gate as the bands above — a 1px highlight on a
                268px frame is not a lit edge, it is a visible seam. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-white/70 to-transparent sm:block"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-px bg-gradient-to-r from-transparent via-white/70 to-transparent sm:block"
            />
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
            {homepageFaqs.map((faq, index) => (
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
                    bullets={faq.bullets}
                    closing={faq.closing}
                    isOpen={openFaq === index}
                    onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>

          {homepageFaqs.length > 4 && (
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
