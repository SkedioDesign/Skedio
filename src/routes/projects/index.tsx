import { siteConfig } from "@/lib/site-config";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { projects, type ProjectSummary } from "@/data/projects";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema, getItemListSchema, getWebPageSchema } from "@/lib/schema";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactModal } from "@/context/use-contact-modal";
import { WebpImage } from "@/components/WebpImage";
import { responsiveFor, HERO_SIZES } from "@/lib/responsive-images";

// Route-scoped serif — the case-study index numeral on each row is
// `font-serif italic` and the first rows sit in the first scroll. Loaded
// via `?url` + head links so the 9 routes that never render Fraunces
// don't declare it (see src/fraunces.css).
import frauncesCss from "@/fraunces.css?url";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: seo({
      title: "Selected Work & Case Studies — Brands and Products by Skédio",
      description:
        "Case studies from Skédio: taxi bidding apps, multi-role delivery platforms, and brand identity systems — with the process, scope, and outcomes behind each one.",
      url: "/projects",
    }),
    links: [...canonicalLink("/projects"), { rel: "stylesheet", href: frauncesCss }],
  }),
  component: ProjectsHub,
});

function ProjectsHub() {
  const { openContactModal } = useContactModal();

  const published = projects.filter((p) => p.published);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Projects", item: "/projects" },
  ]);

  const itemListSchema = getItemListSchema(
    "Skédio Selected Work",
    published.map((p) => ({ name: p.name, url: `/projects/${p.slug}` })),
  );

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData
        data={[
          breadcrumbSchema,
          itemListSchema,
          getWebPageSchema({
            path: "/projects",
            name: "Selected Work & Case Studies — Brands and Products by Skédio",
            description:
              "Case studies of brands and digital products designed and built by Skédio.",
          }),
        ]}
      />

      <SiteHeader
        links={[
          { label: "Work", current: true },
          { label: "Services", to: "/services" },
          { label: "Blog", to: "/blog" },
          { label: "About", to: "/about" },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto w-full max-w-[1440px] px-6 pt-16 md:px-12 md:pt-24 lg:pt-28">
        <ScrollReveal>
          <Breadcrumbs
            items={[
              { name: "Home", item: "/" },
              { name: "Projects", item: "/projects" },
            ]}
          />
        </ScrollReveal>

        <div className="mt-10 max-w-4xl">
          <ScrollReveal>
            <p className="eyebrow">Selected work</p>
            <h1 className="type-h1 mt-4">
              Case studies from brands and products we&apos;ve{" "}
              <span className="sk-hero-accent">shipped.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-8">
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Every project below includes the brief, the process, and the decisions behind the work
              — not just the final screens. Pick one that looks like the problem you&apos;re trying
              to solve.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Case studies */}
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <div className="space-y-20 md:space-y-28">
          {published.map((project, idx) => (
            <CaseStudyRow key={project.slug} project={project} index={idx} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface-alt text-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-white/60">Your project next</p>
              <h2 className="type-h2 mt-4">Got something in mind that belongs on this page?</h2>
              <p className="mt-5 text-base leading-relaxed text-white/70">
                {`Tell us about the product or brand you're building. You'll hear back within ${siteConfig.responseTime}.`}
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

function CaseStudyRow({ project, index }: { project: ProjectSummary; index: number }) {
  const responsive = responsiveFor(project.cover);
  const hasResponsive = responsive.webpSrcSet.length > 0;
  const reversed = index % 2 === 1;

  const facts: Array<{ label: string; value: string }> = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Discipline", value: project.discipline },
    { label: "Scope", value: project.scope },
  ];

  return (
    <ScrollReveal>
      <article className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        {/* Cover */}
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className={`group relative block overflow-hidden rounded-2xl bg-ink shadow-xl lg:col-span-7 ${
            reversed ? "lg:order-2" : ""
          }`}
          aria-label={`${project.name} case study`}
        >
          <WebpImage
            src={responsive.src}
            srcSet={responsive.srcSet}
            webpSrcSet={hasResponsive ? responsive.webpSrcSet : undefined}
            sizes={hasResponsive ? HERO_SIZES : undefined}
            alt={`${project.name} — ${project.line}`}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </Link>

        {/* Copy */}
        <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="font-serif text-2xl italic leading-none tabular-nums text-muted-foreground/50"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-8 bg-border" />
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: project.themeColor }}
            >
              {project.category}
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-balance md:text-4xl">
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="transition-colors hover:text-primary"
            >
              {project.name}
            </Link>
          </h2>

          <p className="mt-3 text-base font-medium text-muted-foreground">{project.line}</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">{project.summary}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-8">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="type-label uppercase tracking-[0.08em] text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <li
                key={service}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {service}
              </li>
            ))}
          </ul>

          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-primary"
          >
            Read the {project.name} case study
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    </ScrollReveal>
  );
}
