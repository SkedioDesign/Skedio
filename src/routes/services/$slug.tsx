import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { getServiceBySlug, servicesData } from "@/data/services";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import {
  getServiceSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  type BreadcrumbItem,
} from "@/lib/schema";
import { useContactModal } from "@/context/use-contact-modal";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqItem } from "@/components/FaqAccordion";

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
          title: "Service Not Found | Skédio",
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
    { name: "Services", item: "/#services" },
    { name: service.shortTitle, item: `/services/${service.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const faqSchema = getFAQSchema(service.faqs);

  const otherServices = servicesData.filter((s) => s.slug !== slug);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData data={[serviceSchema, breadcrumbSchema, faqSchema]} />

      {/* Header / Nav Back */}
      <div className="border-b border-border/70 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Back to Skédio
          </Link>
          <button
            type="button"
            onClick={openContactModal}
            className="rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary-hover cursor-pointer"
          >
            Inquire Now
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-[1200px] px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />
        <div className="max-w-3xl">
          <p className="eyebrow">Service Overview</p>
          <h1 className="type-h1 mt-5 leading-tight">{service.title}</h1>
          <p className="mt-6 text-xl font-medium text-foreground/80 sm:text-2xl">
            {service.tagline}
          </p>

          {/* Quotable AEO Definition Box */}
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              What is {service.shortTitle}?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/90 sm:text-lg">
              {service.definition}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={openContactModal}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-ink-foreground transition-colors hover:bg-primary cursor-pointer"
            >
              Start a {service.shortTitle} Project
              <ArrowUpRight className="size-4" />
            </button>
            <a
              href="#process"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-medium text-foreground hover:border-foreground"
            >
              Our Process
            </a>
          </div>
        </div>
      </section>

      {/* Deliverables & Scope */}
      <section className="border-t border-border bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow">Scope &amp; Deliverables</p>
              <h2 className="type-h2 mt-4">What you receive</h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                We provide tangible, documented systems and production-ready assets engineered for
                growth and long-term maintainability.
              </p>

              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Who this is for
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                  {service.targetAudience.map((audience) => (
                    <li key={audience} className="flex items-start gap-2.5">
                      <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              {service.deliverables.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-transform hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
                    <p className="mt-1 font-semibold text-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Methodology</p>
          <h2 className="type-h2 mt-4">How we work</h2>
          <p className="mt-4 text-muted-foreground">
            A structured, transparent 4-stage sprint process designed to eliminate uncertainty and
            deliver exceptional outcomes on time.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p) => (
            <div
              key={p.step}
              className="rounded-2xl border border-border bg-card p-7 relative flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-4xl font-extrabold text-primary/30">
                  {p.step}
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service FAQs */}
      <section className="border-t border-border bg-surface/30 py-20 md:py-28">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="text-center">
            <p className="eyebrow">Frequently Asked Questions</p>
            <h2 className="type-h2 mt-4">Everything you need to know</h2>
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
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <h3 className="font-bold tracking-tight group-hover:text-primary transition-colors flex items-center justify-between">
                {other.shortTitle}
                <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{other.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
