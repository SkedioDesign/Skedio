import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { insightsArticles } from "@/data/insights";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: seo({
      title: "Insights & Perspectives on Brand, UI/UX & Tech | Skédio",
      description:
        "Explore articles, design thinking frameworks, and strategic essays on brand building, user experience design, and digital product development.",
      url: "/insights",
    }),
    links: canonicalLink("/insights"),
  }),
  component: InsightsList,
});

function InsightsList() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Insights", item: "/insights" },
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData data={breadcrumbs} />

      {/* Header */}
      <div className="border-b border-border/70 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Back to Skédio
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-3xl">
          <p className="eyebrow">Studio Journal</p>
          <h1 className="type-h1 mt-4">Insights &amp; Perspectives</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Thoughtful analyses, tactical breakdowns, and design philosophies on brand strategy,
            user experience, and modern web architecture.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {insightsArticles.map((article) => (
            <Link
              key={article.slug}
              to="/insights/$slug"
              params={{ slug: article.slug }}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="mt-4 text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>{article.datePublished}</span>
                <span className="flex items-center gap-1 font-semibold text-primary">
                  Read article <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
