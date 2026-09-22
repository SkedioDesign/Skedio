import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Zap } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef, useState } from "react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactModal } from "@/context/use-contact-modal";
import { seo, canonicalLink } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatWeDo } from "@/components/WhatWeDo";
import { SelectedWork } from "@/components/SelectedWork";
import { BlogPreview } from "@/components/BlogPreview";
import { Clients } from "@/components/Clients";
import { Testimonials } from "@/components/Testimonials";
import { FaqItem } from "@/components/FaqAccordion";
import { getServiceSchema, getFAQSchema } from "@/lib/schema";
import { servicesData } from "@/data/services";
import { generalFaqs } from "@/data/faq";

import heroDesktopAvif from "@/assets/hero.avif";
import heroDesktopWebp from "@/assets/hero.webp";
import heroMobileAvif from "@/assets/hero-mobile.avif";
import heroMobileWebp from "@/assets/hero-mobile.webp";
import heroFallback from "@/assets/hero.jpg";

gsap.registerPlugin(SplitText);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({
      title: "Skédio — Product Design, Identity & Digital Studio",
      description:
        "Skédio is a creative studio crafting bold brands, beautiful digital experiences, and high-performance digital products that help businesses grow.",
      url: "/",
    }),
    links: canonicalLink("/"),
  }),
  component: Index,
});

const partnerLogos = [
  { type: "text" as const, id: "sc", label: "Social Chums", img: "/Social Chums.png" },
  { type: "text" as const, id: "ed", label: "Edios", img: "/Edios.png" },
  { type: "text" as const, id: "sc2", label: "Social Chums", img: "/Social Chums.png" },
  { type: "text" as const, id: "ed2", label: "Edios", img: "/Edios.png" },
];

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

  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = pageRef.current;
      if (!root) return;

      const title = root.querySelector<HTMLElement>(".sk-hero-title");
      const accent = title?.querySelector<HTMLElement>(".sk-hero-accent") ?? null;

      const reveals = Array.from(
        root.querySelectorAll<HTMLElement>(
          "[data-hero-pill], [data-hero-cta], [data-hero-proof], [data-hero-visual], [data-hero-partner]",
        ),
      );

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(title, { opacity: 1 });
        gsap.set(reveals, { opacity: 1, clearProps: "transform" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (title) {
        const split = SplitText.create(title, { type: "words" });
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
          root.querySelectorAll<HTMLElement>("[data-hero-visual], [data-hero-partner]"),
          { y: 24, opacity: 0, scale: 0.985 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 },
          ">-0.2",
        );
    },
    { scope: pageRef },
  );

  const serviceSchemas = servicesData.map((s) =>
    getServiceSchema({
      name: s.title,
      description: s.definition,
      url: `/services/${s.slug}`,
      serviceType: s.shortTitle,
      deliverables: s.deliverables,
    }),
  );
  const faqSchema = getFAQSchema(generalFaqs);

  return (
    <div id="main-content" ref={pageRef} className="min-h-screen bg-background text-foreground">
      <StructuredData data={[...serviceSchemas, faqSchema]} />

      {/* Nav */}
      <SiteHeader
        links={[
          { label: "Work", to: "/", hash: "work" },
          { label: "Services", to: "/", hash: "services" },
          { label: "Blog", to: "/", hash: "blog" },
          { label: "About", to: "/about" },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-0 md:px-12 md:pt-24 lg:pt-28">
        <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-5 lg:gap-10">
          {/* Left column (~60%) */}
          <div className="lg:col-span-3">
            <h1 className="type-h1 sk-hero-start sk-hero-title">
              We build brands and digital
              <br />
              products that make an <span className="sk-hero-accent">impact.</span>
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 sm:flex-nowrap sm:gap-x-2">
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
              Get reply within 36 hours
            </p>
          </div>

          {/* Right column (~40%, lower) — partner card only on desktop */}
          <div data-hero-partner className="sk-hero-start hidden lg:col-span-2 lg:block">
            <div className="rounded-2xl border border-border bg-surface/60 p-8 lg:p-10">
              <p className="eyebrow text-center">Partner with</p>
              <div className="sk-marquee mt-6 overflow-hidden">
                <div className="sk-marquee-track flex w-max items-center gap-x-10">
                  {partnerLogos.map((item, i) => (
                    <div
                      key={`${item.id}-${i}`}
                      className="flex h-16 w-52 shrink-0 items-center justify-center"
                    >
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.label}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                        />
                      ) : (
                        <span className="whitespace-nowrap text-center font-display text-xl font-bold tracking-tight text-foreground/50 transition-colors duration-300 hover:text-foreground">
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

        {/* Hero visual — single <picture>, format + size chosen via media query */}
        <div data-hero-visual className="sk-hero-start mt-10 lg:mt-24">
          <picture>
            <source media="(min-width: 1024px)" srcSet={heroDesktopAvif} type="image/avif" />
            <source media="(min-width: 1024px)" srcSet={heroDesktopWebp} type="image/webp" />
            <source srcSet={heroMobileAvif} type="image/avif" />
            <source srcSet={heroMobileWebp} type="image/webp" />
            <img
              src={heroFallback}
              alt="Skédio design studio hero showcase — bold brand identity and product design"
              fetchPriority="high"
              loading="eager"
              width={1440}
              height={810}
              className="aspect-[16/9] w-full rounded-2xl object-cover"
            />
          </picture>
        </div>

        {/* Responsive: bare logo marquee below the copy (no card, no label) */}
        <div className="mt-10 lg:hidden">
          <div className="sk-marquee overflow-hidden">
            <div className="sk-marquee-track flex w-max items-center gap-x-10">
              {partnerLogos.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="flex h-auto shrink-0 items-center justify-center px-2 py-2"
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.label}
                      loading="lazy"
                      decoding="async"
                      className="h-18 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <span className="whitespace-nowrap font-display text-2xl font-bold tracking-tight text-foreground/50 transition-colors duration-300 hover:text-foreground">
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
            {(showMore ? generalFaqs : generalFaqs.slice(0, 4)).map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index % 3}>
                <FaqItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === index}
                  onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                />
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
    </div>
  );
}
