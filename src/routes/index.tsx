import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Zap, HelpCircle } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactModal } from "@/context/contact-modal-context";
import { seo, canonicalLink } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { SiteHeader } from "@/components/SiteHeader";
import { getServiceSchema, getFAQSchema } from "@/lib/schema";
import { servicesData } from "@/data/services";
import { generalFaqs } from "@/data/faq";
import { blogPosts } from "@/data/blog";

import hero from "@/assets/hero.png";
import svcStrategy from "@/assets/svc-strategy.jpg";
import svcIdentity from "@/assets/svc-identity.jpg";
import svcDesign from "@/assets/svc-design.jpg";
import svcUiux from "@/assets/svc-uiux.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({
      title: "Skédio — Brand Strategy, Identity & Digital Product Design Studio",
      description:
        "Skédio is a creative studio crafting bold brands, beautiful digital experiences, and high-performance digital products that help businesses grow.",
      url: "/",
    }),
    links: canonicalLink("/"),
  }),
  component: Index,
});

const serviceCardImages: Record<string, string> = {
  "brand-strategy": svcStrategy,
  "brand-identity": svcIdentity,
  "ui-ux-design": svcUiux,
  "product-development": svcDesign,
};

const projects = [
  {
    name: "HAO Cabs",
    slug: "haocabs",
    line: "A Taxi Bidding Experience App",
    tag: "Product Design, UI/UX",
    img: "/HaoCabs/cover.png",
  },
];

const clientLogos = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  src: `/Clients/${i + 1}.png`,
  alt: `Client logo ${i + 1}`,
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

  const sizes = variant === "ink" ? "px-5 py-3.5 md:px-7" : "px-6 py-3";

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
      <section className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-16 md:px-12 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-5 lg:gap-10">
          {/* Left column (~60%) */}
          <div className="lg:col-span-3">
            <h1 className="type-h1 sk-rise sk-hero-title">
              We build brands and digital
              <br />
              products that make an <span className="sk-hero-accent">impact.</span>
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {servicesData.map((s) => (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="rounded-md border border-border bg-surface px-4 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary"
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

          {/* Right column (~40%, lower) */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-surface/60 p-8 lg:p-10">
              <p className="eyebrow text-center">Partner with</p>
              <div className="sk-marquee mt-6 overflow-hidden">
                <div className="sk-marquee-track flex w-max items-center gap-x-10">
                  {[
                    {
                      type: "text" as const,
                      id: "sc",
                      label: "Social Chums",
                      img: "/Social Chums.png",
                    },
                    { type: "text" as const, id: "nt", label: "Nuvance Technology" },
                    { type: "text" as const, id: "ed", label: "Edios", img: "/Edios.png" },
                    {
                      type: "text" as const,
                      id: "sc2",
                      label: "Social Chums",
                      img: "/Social Chums.png",
                    },
                    { type: "text" as const, id: "nt2", label: "Nuvance Technology" },
                    { type: "text" as const, id: "ed2", label: "Edios", img: "/Edios.png" },
                  ].map((item, i) => (
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
      </section>

      {/* Hero visual with LCP optimization */}
      <section className="mx-auto w-full max-w-[1440px] px-6 md:px-12">
        <img
          src={hero}
          alt="Skédio design studio hero showcase — bold brand strategy and product design"
          fetchPriority="high"
          loading="eager"
          width={1440}
          height={810}
          className="aspect-[16/9] w-full rounded-2xl object-cover"
        />
      </section>

      <div className="bg-background">
        {/* Services */}
        <section
          id="services"
          className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 py-24 lg:py-28"
        >
          <ScrollReveal>
            <p className="eyebrow">What we do</p>
            <h2 className="type-h2 mt-5">Services that drive brands forward</h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {servicesData.map((s, idx) => (
              <ScrollReveal key={s.slug} delay={idx}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group block h-full overflow-hidden rounded-xl border border-border bg-card shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-card-hover"
                >
                  <img
                    src={serviceCardImages[s.slug]}
                    alt={s.title}
                    loading="lazy"
                    width={700}
                    height={560}
                    className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="p-6">
                    <h3 className="type-h6 group-hover:text-primary transition-colors flex items-center justify-between">
                      {s.shortTitle}
                      <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="type-sm mt-2.5 text-muted-foreground">{s.tagline}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Work */}
        <section
          id="work"
          className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-24 lg:pb-28"
        >
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Featured project</p>
                <h2 className="type-h2 mt-5">Selected work</h2>
              </div>
              <Link
                to="/projects/$slug"
                params={{ slug: "haocabs" }}
                className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-foreground transition-colors duration-250 ease-out hover:border-ink hover:bg-ink hover:text-ink-foreground"
              >
                Explore Case Study
                <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-12">
            {projects.map((p) => (
              <ScrollReveal key={p.name} delay={1}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group relative block overflow-hidden rounded-2xl bg-ink shadow-2xl transition-transform duration-300 ease-out hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
                    <img
                      src={p.img}
                      alt={`${p.name} — ${p.line}`}
                      loading="lazy"
                      width={1600}
                      height={900}
                      className="h-full w-full object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-12">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-display text-2xl font-bold sm:text-4xl">
                              {p.name}
                            </h3>
                            <span className="rounded-full bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-black">
                              Case Study
                            </span>
                          </div>
                          <p className="type-base mt-2 text-white/80 sm:text-lg">{p.line}</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors duration-250 ease-out group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                          View Project <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section
          id="blog"
          className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-24 lg:pb-32"
        >
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Blog</p>
                <h2 className="type-h2 mt-5">Read our latest thoughts</h2>
              </div>
              <Link
                to="/blog"
                className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-foreground transition-colors duration-250 ease-out hover:border-ink hover:bg-ink hover:text-ink-foreground"
              >
                View All Articles
                <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, idx) => (
              <ScrollReveal key={post.slug} delay={idx} className="h-full">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all duration-250 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-card"
                >
                  <div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {post.category}
                    </span>
                    <p className="mt-3 type-caption text-muted-foreground">{post.publishedAt}</p>
                    <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {post.metaDescription}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    Read Article{" "}
                    <ArrowRight className="size-3.5 transition-transform duration-250 ease-out group-hover:translate-x-1" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Clients */}
        <section
          id="clients"
          className="mx-auto w-full max-w-[1360px] scroll-mt-24 px-6 pb-28 lg:pb-36"
        >
          <ScrollReveal>
            <div className="mb-14 text-center lg:mb-20">
              <h2 className="font-display text-center text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Clients
              </h2>
              <p className="mt-3 type-body text-center text-muted-foreground sm:text-lg">
                We'll let the brands speak for us
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-10 md:grid-cols-4 lg:grid-cols-4">
            {clientLogos.map((c, idx) => (
              <ScrollReveal
                key={c.id}
                delay={idx % 4}
                className="flex h-32 w-full items-center justify-center p-3 sm:h-36 lg:h-44"
              >
                <img
                  src={c.src}
                  alt={c.alt}
                  loading="lazy"
                  width={360}
                  height={180}
                  className="max-h-24 w-auto max-w-[240px] cursor-pointer object-contain grayscale opacity-60 transition-all duration-300 ease-out hover:scale-110 hover:opacity-100 hover:grayscale-0 sm:max-h-28 sm:max-w-[280px] lg:max-h-36 lg:max-w-[320px]"
                />
              </ScrollReveal>
            ))}
          </div>
        </section>

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
