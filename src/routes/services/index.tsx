import { siteConfig } from "@/lib/site-config";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

import { projects } from "@/data/projects";
import { servicesData } from "@/data/services";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/schema";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactModal } from "@/context/use-contact-modal";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: seo({
      title: "Design & Development Services for Brands and Digital Products | Skédio",
      description:
        "Skédio is a creative studio offering product design, brand identity, UI/UX design, and full-stack product development services for startups and growing brands.",
      url: "/services",
    }),
    links: canonicalLink("/services"),
  }),
  component: ServicesHub,
});

const engagementSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start by auditing what exists, interviewing your team and users, and agreeing on the problem worth solving before a single screen is drawn.",
  },
  {
    step: "02",
    title: "Direction",
    description:
      "Strategy, positioning, and visual direction are explored in parallel so the brand and the product stay one coherent idea.",
  },
  {
    step: "03",
    title: "Design",
    description:
      "We build and test in the open — prototypes, systems, and flows reviewed with you every step so nothing is a surprise at handoff.",
  },
  {
    step: "04",
    title: "Delivery",
    description:
      "Production-ready assets, documented systems, and hands-on support through build and launch, then iteration once real data arrives.",
  },
];

function ServicesHub() {
  const { openContactModal } = useContactModal();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
  ]);

  const itemListSchema = getItemListSchema(
    "Skédio Services",
    servicesData.map((s) => ({ name: s.shortTitle, url: `/services/${s.slug}` })),
  );

  const caseStudies = projects.filter((p) => p.published).slice(0, 3);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData data={[breadcrumbSchema, itemListSchema]} />

      <SiteHeader
        links={[
          { label: "Work", to: "/" },
          { label: "Services", current: true },
          { label: "Blog", to: "/blog" },
          { label: "About", to: "/about" },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto w-full max-w-[1440px] px-6 pt-16 pb-0 md:px-12 md:pt-24 lg:pt-28">
        <ScrollReveal>
          <Breadcrumbs
            items={[
              { name: "Home", item: "/" },
              { name: "Services", item: "/services" },
            ]}
          />
        </ScrollReveal>

        <div className="mt-10 max-w-4xl">
          <ScrollReveal>
            <p className="eyebrow">Capabilities</p>
            <h1 className="type-h1 mt-4">
              Services that turn ambitious ideas into{" "}
              <span className="sk-hero-accent">brands and products</span> people choose.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-8">
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We work end to end — from the first positioning workshop to the shipped interface.
              Pick the capability you need, or combine them into one engagement run by a single
              team.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Service cards */}
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {servicesData.map((service, idx) => (
            <ScrollReveal key={service.slug} delay={idx * 0.06}>
              <Link
                to="/services/$slug"
                params={{ slug: service.slug }}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md md:p-10"
              >
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="font-serif text-2xl italic leading-none tabular-nums text-muted-foreground/50"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-8 bg-border" />
                  <span className="eyebrow">{service.shortTitle}</span>
                </div>

                <h2 className="mt-6 text-2xl font-bold leading-snug tracking-tight text-balance transition-colors group-hover:text-primary md:text-[1.75rem]">
                  {service.title}
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {service.tagline}
                </p>

                <ul className="mt-7 space-y-2.5 border-t border-border pt-7">
                  {service.deliverables.slice(0, 3).map((deliverable) => (
                    <li
                      key={deliverable}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  Explore {service.shortTitle}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Engagement model */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
          <ScrollReveal>
            <p className="eyebrow">How we engage</p>
            <h2 className="type-h2 mt-4 max-w-2xl">One process, whichever services you choose.</h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {engagementSteps.map((item, idx) => (
              <ScrollReveal key={item.step} delay={idx * 0.06}>
                <div className="border-t border-border pt-6">
                  <span className="font-serif text-sm italic tabular-nums text-muted-foreground/60">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related work */}
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Proof</p>
              <h2 className="type-h2 mt-4">Services in practice</h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              See all work
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {caseStudies.map((project, idx) => (
            <ScrollReveal key={project.slug} delay={idx * 0.06}>
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
              >
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary self-start">
                  {project.tag}
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.line}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  Read case study <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface-alt text-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-white/60">Next step</p>
              <h2 className="type-h2 mt-4">
                Tell us what you're building and we'll tell you how we'd approach it.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/70">
                {`Send a few lines about your product, brand, or timeline. You'll hear back within ${siteConfig.responseTime} — no pitch deck required.`}
              </p>
              <button
                type="button"
                onClick={openContactModal}
                className="group type-button mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
              >
                Start a conversation
                <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-4" />
                </span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
