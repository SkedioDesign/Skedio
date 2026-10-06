import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  Check,
  CheckCircle2,
  Compass,
  Layout,
  Smartphone,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { useState } from "react";

import { getServiceBySlug, servicesData } from "@/data/services";
import { getProjectsForService } from "@/data/projects";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import {
  getBreadcrumbSchema,
  getFAQSchema,
  getServiceSchema,
  getWebPageSchema,
  type BreadcrumbItem,
} from "@/lib/schema";
import { useContactModal } from "@/context/use-contact-modal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqItem } from "@/components/FaqAccordion";
import { WebpImage } from "@/components/WebpImage";
import { responsiveFor, COMPACT_SIZES } from "@/lib/responsive-images";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const service = getServiceBySlug(params.slug);
    if (!service) throw notFound();
    return { service, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const service = loaderData?.service;
    if (!service) {
      return {
        meta: seo({
          title: "Service Not Found | Skédio Design Studio",
          description: "The requested service could not be found.",
          noindex: true,
        }),
      };
    }

    return {
      meta: seo({
        title: service.metaTitle,
        description: service.metaDescription,
        image: service.ogImage,
        url: `/services/${service.slug}`,
        themeColor: service.themeColor,
      }),
      links: canonicalLink(`/services/${service.slug}`),
    };
  },
  component: ServiceDetail,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <main id="main-content" className="grid min-h-[70vh] place-items-center px-6 py-24 text-center">
      <div className="max-w-md">
        <h1 className="type-h2">Service Not Found</h1>
        <p className="mt-4 text-muted-foreground">The requested service could not be located.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> Return to Home
        </Link>
      </div>
    </main>
  );
}

const DELIVERABLE_ICONS = [Compass, Workflow, Layout, Smartphone, Boxes];
const PROCESS_ICONS = [Compass, Workflow, Layout, Boxes];

function ServiceDetail() {
  const { service, slug } = Route.useLoaderData();
  const { openContactModal } = useContactModal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceSchema = getServiceSchema({
    name: service.title,
    description: service.definition,
    url: `/services/${service.slug}`,
    serviceType: service.shortTitle,
    deliverables: service.deliverables,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: service.shortTitle, item: `/services/${service.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const faqSchema = getFAQSchema(service.faqs);

  const otherServices = servicesData.filter((s) => s.slug !== slug);
  const relatedProjects = getProjectsForService(service.slug);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData
        data={[
          serviceSchema,
          breadcrumbSchema,
          faqSchema,
          getWebPageSchema({
            path: `/services/${service.slug}`,
            name: service.metaTitle,
            description: service.metaDescription,
          }),
        ]}
      />

      {/* Header / Nav Back */}
      <div className="border-b border-border/70 bg-background/85 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground/75 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Home</span>
            <span className="text-muted-foreground/60 hidden sm:inline">/</span>
            <span className="text-foreground font-bold">{service.shortTitle}</span>
          </Link>
          <button
            type="button"
            onClick={openContactModal}
            className="rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-xs transition-all duration-200 hover:bg-primary-hover hover:shadow-md cursor-pointer"
          >
            Inquire Now
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 pb-20 pt-12 md:pb-28 md:pt-20">
        {/* Ambient background glow & subtle dot matrix */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-primary/10 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_70%,transparent_100%)]"
        />

        <div className="relative mx-auto max-w-[1200px] px-6">
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {service.eyebrow || "Service Overview"}
            </div>

            <h1 className="type-h1 mt-5 text-balance font-light leading-[1.08] tracking-tight text-foreground">
              {service.title}
            </h1>

            <p className="mt-6 text-xl font-normal leading-relaxed text-muted-foreground sm:text-2xl sm:leading-relaxed">
              {service.tagline}
            </p>

            {/* Quotable AEO Definition Box */}
            <div className="group relative mt-10 overflow-hidden rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-card transition-all duration-300 hover:border-primary/40">
              <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-primary via-primary/70 to-primary/20" />
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles className="size-4" />
                <span>What is {service.shortTitle}?</span>
              </div>
              <blockquote className="mt-3.5 text-base font-medium leading-relaxed text-foreground/90 sm:text-lg">
                “{service.definition}”
              </blockquote>
              {service.highlights && service.highlights.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-border/60 pt-4 text-xs font-semibold text-muted-foreground">
                  {service.highlights.map((highlight) => (
                    <span key={highlight} className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-primary" /> {highlight}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={openContactModal}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-ink-foreground shadow-md transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 cursor-pointer"
              >
                {service.primaryCta || `Start a ${service.shortTitle} Project`}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <a
                href="#process"
                className="inline-flex items-center gap-2 rounded-full border border-border/90 bg-card/70 backdrop-blur-sm px-7 py-4 text-sm font-semibold text-foreground transition-all duration-200 hover:border-foreground hover:bg-card cursor-pointer shadow-xs"
              >
                {service.secondaryCta || "Our Process"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables & Scope */}
      <section className="relative border-b border-border bg-surface/40 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <p className="eyebrow">Scope &amp; Deliverables</p>
              <h2 className="type-h2 mt-4">{service.deliverablesHeading || "What you receive"}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {service.deliverablesIntro ||
                  "We provide tangible, documented systems and production-ready assets engineered for growth and long-term maintainability."}
              </p>

              <div className="mt-8 rounded-2xl border border-border/80 bg-card p-6 md:p-7 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Target className="size-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {service.targetAudienceHeading || "Who this is for"}
                  </h3>
                </div>
                <ul className="mt-5 space-y-3.5 text-sm">
                  {service.targetAudience.map((audience) => (
                    <li key={audience} className="flex items-start gap-3">
                      <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-3 stroke-[2.5]" />
                      </span>
                      <span className="text-foreground/85 leading-relaxed">{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {service.deliverables.map((item, index) => {
                const title = typeof item === "string" ? item : item.title;
                const description = typeof item === "string" ? undefined : item.description;
                const Icon = DELIVERABLE_ICONS[index % DELIVERABLE_ICONS.length] ?? CheckCircle2;
                return (
                  <div
                    key={title}
                    className="group relative flex items-start gap-4 sm:gap-5 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground/75">
                          0{index + 1}
                        </span>
                      </div>
                      <h4 className="mt-1 font-heading text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {title}
                      </h4>
                      {description && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Methodology</p>
          <h2 className="type-h2 mt-4">{service.processHeading || "How we work"}</h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {service.processIntro ||
              "A structured, transparent 4-stage sprint process designed to eliminate uncertainty and deliver exceptional outcomes on time."}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p, idx) => {
            const ProcessIcon = PROCESS_ICONS[idx % PROCESS_ICONS.length] ?? CheckCircle2;
            return (
              <div
                key={p.step}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-7 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-card hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle top accent gradient line on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Big watermark step number */}
                <span className="font-display text-5xl font-extrabold text-foreground/5 select-none absolute top-4 right-4 transition-colors group-hover:text-primary/10">
                  {p.step}
                </span>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                      Step {p.step}
                    </span>
                    <div className="size-8 rounded-lg bg-surface flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <ProcessIcon className="size-4" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Work — closes the service -> project -> service loop */}
      {relatedProjects.length > 0 && (
        <section className="border-t border-border bg-surface/30 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="eyebrow">Proof of Work</p>
                <h2 className="type-h2 mt-4">Projects that used this service</h2>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                  Real engagements where {service.shortTitle} was part of the scope.
                </p>
              </div>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary"
              >
                All projects
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => {
                const responsive = responsiveFor(project.cover);
                return (
                  <Link
                    key={project.slug}
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-ink shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-1"
                  >
                    <WebpImage
                      src={responsive.src}
                      srcSet={responsive.srcSet}
                      webpSrcSet={
                        responsive.webpSrcSet.length > 0 ? responsive.webpSrcSet : undefined
                      }
                      sizes={COMPACT_SIZES}
                      alt={`${project.name} — ${project.line}`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className="inline-block rounded-md bg-white/15 backdrop-blur-md px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-widest text-white">
                        {project.category}
                      </span>
                      <h3 className="mt-2 text-xl font-bold tracking-tight text-white group-hover:text-primary-light transition-colors">
                        {project.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-white/75">{project.line}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Service FAQs */}
      <section className="border-t border-border bg-surface/30 py-20 md:py-28">
        <div className="mx-auto max-w-[840px] px-6">
          <div className="text-center max-w-xl mx-auto">
            <p className="eyebrow">Frequently Asked Questions</p>
            <h2 className="type-h2 mt-4">Everything you need to know</h2>
            <p className="mt-4 text-base text-muted-foreground">
              Clear answers on deliverables, process, timelines, and how we collaborate with your
              team.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {service.faqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final High-Impact CTA Banner */}
      <section className="border-t border-border/60 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-8 md:p-14 text-ink-foreground shadow-card">
            {/* Ambient glowing orb in card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/25 blur-[100px]"
            />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-light">
                <Sparkles className="size-3.5" /> Start Your Project
              </span>
              <h2 className="type-h2 mt-4 text-white font-light text-balance">
                {service.bannerHeading || "Ready to build an intuitive, high-converting product?"}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed">
                {service.bannerSubheading ||
                  "Let’s talk through your goals, user flows, and product timeline. We’ll outline a sprint-based plan tailored to your launch."}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={openContactModal}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 font-bold text-sm text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 cursor-pointer"
                >
                  Book a Discovery Call
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
                >
                  Explore Case Studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Services */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <p className="eyebrow">Explore More</p>
        <h2 className="type-h2 mt-4">Other studio capabilities</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {otherServices.map((other) => (
            <Link
              key={other.slug}
              to="/services/$slug"
              params={{ slug: other.slug }}
              className="group rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card"
            >
              <h3 className="font-heading font-bold text-lg tracking-tight group-hover:text-primary transition-colors flex items-center justify-between">
                {other.shortTitle}
                <ArrowUpRight className="size-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
              </h3>
              <p className="mt-2.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {other.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
