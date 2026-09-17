import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Zap, HelpCircle } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactModal } from "@/context/contact-modal-context";
import { seo, canonicalLink } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatWeDo } from "@/components/WhatWeDo";
import { SelectedWork } from "@/components/SelectedWork";
import { BlogPreview } from "@/components/BlogPreview";
import { Clients } from "@/components/Clients";
import { getServiceSchema, getFAQSchema } from "@/lib/schema";
import { servicesData } from "@/data/services";
import { generalFaqs } from "@/data/faq";

import hero from "@/assets/hero.png";

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
  { type: "text" as const, id: "nt", label: "Nuvance Technology" },
  { type: "text" as const, id: "ed", label: "Edios", img: "/Edios.png" },
  { type: "text" as const, id: "sc2", label: "Social Chums", img: "/Social Chums.png" },
  { type: "text" as const, id: "nt2", label: "Nuvance Technology" },
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
    <div id="main-content" className="min-h-screen bg-background text-foreground">
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
      <section className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-0 md:px-12 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-5 lg:gap-10">
          {/* Left column (~60%) */}
          <div className="lg:col-span-3">
            <h1 className="type-h1 sk-rise sk-hero-title">
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
                  className="whitespace-nowrap rounded-md border border-border bg-surface px-4 py-1.5 text-sm font-medium leading-tight text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary sm:px-3 sm:text-[0.8125rem] lg:px-2.5"
                >
                  {s.shortTitle}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 md:gap-3">
              <PillLink href="#work" variant="ink">
                View our works
              </PillLink>
              <PillLink onClick={openContactModal} variant="outline">
                Let's Talk
              </PillLink>
            </div>

            <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="size-4 text-primary" />
              Get reply within 36 hours
            </p>
          </div>

          {/* Right column (~40%, lower) — partner card only on desktop */}
          <div className="hidden lg:col-span-2 lg:block">
            <div className="rounded-2xl border border-border bg-surface/60 p-8 lg:p-10">
              <p className="eyebrow text-center">Partner with</p>
              <div className="sk-marquee mt-6 overflow-hidden">
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
          </div>
        </div>

        {/* Responsive: hero visual after the copy */}
        <div className="mt-10 lg:hidden">
          <img
            src={hero}
            alt="Skédio design studio hero showcase — bold brand identity and product design"
            fetchPriority="high"
            loading="eager"
            width={1440}
            height={810}
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
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

      {/* Hero visual with LCP optimization — desktop only; mobile version sits below the copy */}
      <section className="mx-auto hidden w-full max-w-[1440px] px-6 md:px-12 lg:block">
        <img
          src={hero}
          alt="Skédio design studio hero showcase — bold brand identity and product design"
          fetchPriority="high"
          loading="eager"
          width={1440}
          height={810}
          className="aspect-[16/9] w-full rounded-2xl object-cover"
        />
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

        {/* FAQs Section (High-Leverage AEO Surface) */}
        <section
          id="faqs"
          className="mx-auto w-full max-w-[900px] scroll-mt-24 px-6 pb-24 lg:pb-32"
        >
          <ScrollReveal>
            <div className="text-center">
              <p className="eyebrow">Studio FAQs</p>
              <h2 className="type-h2 mt-4">Questions you might have</h2>
              <p className="mt-3 text-muted-foreground">
                Clear answers on pricing, timelines, deliverables, and how we work with founders.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 space-y-4">
            {showMore
              ? generalFaqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <ScrollReveal key={faq.question} delay={index % 3}>
                      <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="flex w-full items-center justify-between p-6 text-left font-semibold text-foreground cursor-pointer"
                          aria-expanded={isOpen}
                        >
                          <span className="flex items-center gap-3 pr-4">
                            <HelpCircle className="size-5 text-primary shrink-0" />
                            {faq.question}
                          </span>
                          <span className="text-xl leading-none text-muted-foreground">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="border-t border-border px-6 pt-4 pb-6 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  );
                })
              : generalFaqs.slice(0, 4).map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <ScrollReveal key={faq.question} delay={index % 3}>
                      <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="flex w-full items-center justify-between p-6 text-left font-semibold text-foreground cursor-pointer"
                          aria-expanded={isOpen}
                        >
                          <span className="flex items-center gap-3 pr-4">
                            <HelpCircle className="size-5 text-primary shrink-0" />
                            {faq.question}
                          </span>
                          <span className="text-xl leading-none text-muted-foreground">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="border-t border-border px-6 pt-4 pb-6 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  );
                })}
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
