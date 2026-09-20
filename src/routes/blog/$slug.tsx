import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

import { blogPosts } from "@/data/blog";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/schema";
import { useContactModal } from "@/context/use-contact-modal";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
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
        title: `${post.title} | Skédio Blog`,
        description: post.metaDescription,
        image: post.ogImage,
        url: `/blog/${post.slug}`,
        type: "article",
      }),
      links: canonicalLink(`/blog/${post.slug}`),
    };
  },
  component: BlogPost,
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
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> Return to Blog
        </Link>
      </div>
    </main>
  );
}

function BlogPost() {
  const { post, slug } = Route.useLoaderData();
  const { openContactModal } = useContactModal();

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.metaDescription,
    slug: post.slug,
    datePublished: post.publishedAt,
    authorName: "Skédio Studio",
    image: post.ogImage,
  });

  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: post.title, item: `/blog/${post.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const moreArticles = blogPosts.filter((a) => a.slug !== slug);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData data={[articleSchema, breadcrumbSchema]} />

      {/* Header */}
      <div className="border-b border-border/70 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Back to Blog
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
          <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            {post.category}
          </span>
        </div>

        <h1 className="type-h1 mt-6 leading-tight">{post.title}</h1>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-border py-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">{/* Author info could be added here */}</div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span>{post.publishedAt}</span>
          </div>
        </div>

        {/* Article Body */}
        <div
          className="prose-skedio mt-12"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked.parse(post.content) as string),
          }}
        />

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
                  to="/blog/$slug"
                  params={{ slug: other.slug }}
                  className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
                >
                  <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {other.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {other.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
