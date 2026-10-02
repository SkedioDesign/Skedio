import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Zap } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
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
            "[data-hero-pill], [data-hero-cta], [data-hero-proof], [data-hero-partner]",
          ),
        );

        const visual = root.querySelector<HTMLElement>("[data-hero-visual]");

        // READS BEFORE WRITES. Every querySelector above and the Split() call
        // below happen BEFORE the first gsap.set()/fromTo(), and nothing after
        // this point reads geometry — so no write-then-read interleaving forces
        // a second synchronous layout within the setup.
        tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (title) {
          split = SplitText.create(title, { type: "words" });
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
      rafs.push(requestAnimationFrame(step));

      // Tweens built inside the deferred callback are created after
      // gsap.context() has already run, so useGSAP's automatic revert does not
      // capture them — they are killed explicitly here instead.
      return () => {
        disposed = true;
        rafs.forEach((id) => cancelAnimationFrame(id));
        tl?.kill();
        split?.revert();
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

      {/* Hero */}
      <section className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-0 md:px-12 md:pt-24 lg:pt-28">
        <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-5 lg:gap-10">
          {/* Left column (~60%) */}
          <div className="lg:col-span-3">
            {/* The space before <br /> is load-bearing — do not let a
                formatter or reflow move it onto the next line. JSX trims
                trailing whitespace on any text line that is followed by a
                newline, so "digital\n<br />" renders as the single
                misspelled word "digitalproducts" once tags are stripped, which
                is what Googlebot's H1 extraction, screen readers and social
                scrapers read. It survives here only because the text node
                holds no newline of its own. The <br /> still owns the visual
                break; a space before a line break collapses and is invisible. */}
            <h1 className="type-h1 sk-hero-start sk-hero-title">
              We build brands and digital <br />
              products that make an <span className="sk-hero-accent">impact.</span>
            </h1>

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
        <div data-hero-visual className="mt-10 lg:mt-24">
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
