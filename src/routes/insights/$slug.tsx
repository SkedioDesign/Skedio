import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, User } from "lucide-react";

import { getInsightBySlug, insightsArticles } from "@/data/insights";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { getArticleSchema, getBreadcrumbSchema, type BreadcrumbItem } from "@/lib/schema";
import { useContactModal } from "@/context/use-contact-modal";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => {
    const article = getInsightBySlug(params.slug);
    if (!article) throw notFound();
    return { article, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) {
      return {
        meta: seo({
          title: "Article Not Found | Skédio",
          description: "The requested article could not be found.",
          noindex: true,
        }),
      };
    }

    return {
      meta: seo({
        title: `${article.title} | Skédio Insights`,
        description: article.excerpt,
        image: article.coverImage,
        url: `/insights/${article.slug}`,
        type: "article",
      }),
      links: canonicalLink(`/insights/${article.slug}`),
    };
  },
  component: InsightPost,
  notFoundComponent: ArticleNotFound,
});

function ArticleNotFound() {
  return (
    <main id="main-content" className="grid min-h-[70vh] place-items-center px-6 py-24 text-center">
      <div className="max-w-md">
        <h1 className="type-h2">Article Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The article you are looking for does not exist.
        </p>
        <Link
          to="/insights"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> Return to Insights
        </Link>
      </div>
    </main>
  );
}

function InsightPost() {
  const { article, slug } = Route.useLoaderData();
  const { openContactModal } = useContactModal();

  const articleSchema = getArticleSchema({
    title: article.title,
    description: article.excerpt,
    slug: article.slug,
    datePublished: article.datePublished,
    authorName: article.author.name,
    image: article.coverImage,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", item: "/" },
    { name: "Insights", item: "/insights" },
    { name: article.title, item: `/insights/${article.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const moreArticles = insightsArticles.filter((a) => a.slug !== slug);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData data={[articleSchema, breadcrumbSchema]} />

      {/* Header */}
      <div className="border-b border-border/70 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 py-4">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" /> All Insights
          </Link>
          <button
            type="button"
            onClick={openContactModal}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary-hover cursor-pointer"
          >
            Work With Us
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[900px] px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-3">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="type-h1 mt-6 leading-tight">{article.title}</h1>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-border py-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            {article.author.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <User className="size-4" />
            )}
            <span className="font-medium text-foreground">{article.author.name}</span>
            <span className="text-muted-foreground/60">• {article.author.role}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span>{article.datePublished}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{article.readingTime}</span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose-skedio mt-12 space-y-10">
          <p className="text-xl font-medium leading-relaxed text-foreground/90 sm:text-2xl">
            {article.excerpt}
          </p>

          {article.content.map((section, idx) => (
            <section key={idx} className="space-y-4">
              {section.heading && (
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-8">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-base leading-relaxed text-foreground/80 sm:text-lg">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 text-center md:p-12">
          <h3 className="type-h3">Ready to build something impactful?</h3>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Partner with Skédio to craft thoughtful brand strategies, visual identities, and digital
            products that accelerate growth.
          </p>
          <button
            type="button"
            onClick={openContactModal}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-bold text-primary-foreground transition-all hover:bg-primary-hover cursor-pointer"
          >
            Start a Conversation <ArrowUpRight className="size-4" />
          </button>
        </div>
      </article>

      {/* Read More Section */}
      {moreArticles.length > 0 && (
        <section className="border-t border-border bg-surface/30 py-20">
          <div className="mx-auto max-w-[900px] px-6">
            <p className="eyebrow">More Articles</p>
            <h2 className="type-h3 mt-2">Continue reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {moreArticles.map((other) => (
                <Link
                  key={other.slug}
                  to="/insights/$slug"
                  params={{ slug: other.slug }}
                  className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
                >
                  <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {other.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{other.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
