import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, UserRound } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { seo, canonicalLink, toAbsoluteUrl } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import {
  getArticleSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getWebPageSchema,
} from "@/lib/schema";
import { useContactModal } from "@/context/use-contact-modal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleRelatedLinks } from "@/components/ArticleRelatedLinks";
import { SocialLinks, type TeamSocials } from "@/components/SocialLinks";
import { ShareButton } from "@/components/ShareButton";
import { WebpImage } from "@/components/WebpImage";
import teamSocialsData from "@/data/team-socials.json";

/** The byline's links and photo, read from the same team roster the about page
 *  uses, so an author is described once rather than restated per post. A name
 *  absent from that file falls back to no links and no photo. */
const memberFor = (name?: string) =>
  name ? teamSocialsData.members.find((m) => m.name === name) : undefined;

const socialsFor = (name?: string): TeamSocials => memberFor(name)?.socials ?? {};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    // `marked` is ~50 KB of the client entry bundle and this loader is its
    // only consumer. routeTree.gen.ts statically imports every route module,
    // so a static import here put the markdown parser into the critical chunk
    // of all 14 routes — the homepage shipped a parser it never runs.
    // Importing it here keeps it out of the entry graph entirely. SSR still
    // awaits it, so article HTML is server-rendered exactly as before and
    // direct visits keep their SEO payload; only client-side navigations pay
    // the extra (already-cached-after-first-visit) chunk fetch.
    const { renderMarkdown } = await import("@/lib/markdown");
    return { post, slug: params.slug, html: renderMarkdown(post.content) };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: seo({
          title: "Article Not Found | Skédio Insights",
          description: "The requested article could not be found.",
          noindex: true,
        }),
      };
    }

    return {
      meta: seo({
        // `metaTitle`, not `${post.title} | Skédio Blog`: the suffix overflowed
        // Google's 60-character limit on the longer titles, and the field
        // already exists so each post can state a title that fits.
        title: post.metaTitle,
        description: post.metaDescription,
        image: post.ogImage,
        url: `/blog/${post.slug}`,
        type: "article",
        publishedTime: post.publishedAt,
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
  const { post, slug, html } = Route.useLoaderData();
  const { openContactModal } = useContactModal();
  const authorPhoto = memberFor(post.author)?.img;

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    datePublished: post.publishedAt,
    // The byline. This used to be hardcoded to "Skédio Studio", so a post
    // crediting a named author still claimed the studio here — and this is the
    // one place crawlers read.
    authorName: post.author ?? "Skédio",
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
      <StructuredData
        data={[
          articleSchema,
          breadcrumbSchema,
          getWebPageSchema({
            path: `/blog/${post.slug}`,
            name: post.metaTitle,
            description: post.metaDescription,
            datePublished: post.publishedAt,
          }),
          // Only when the post declares them. Google requires FAQPage
          // markup to match content visible on the page, so this is driven
          // from the post's own FAQ section rather than generated here.
          ...(post.faqs?.length ? [getFAQSchema(post.faqs)] : []),
        ]}
      />

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

        {/* The date sits in a <time> with the machine-readable value in
            `dateTime`; the old raw ISO string told readers nothing. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border py-4 text-sm text-muted-foreground">
          {/* Name, photo and links travel together: they identify the same
              person, and the icons are `size-8` tap targets, so they read as
              the author's row rather than as loose buttons beside the date.
              The photo is decorative — the name is right beside it in the same
              row, so an alt would only repeat it for screen reader users. */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              {authorPhoto ? (
                <WebpImage
                  src={authorPhoto}
                  alt=""
                  aria-hidden="true"
                  width={36}
                  height={36}
                  loading="lazy"
                  decoding="async"
                  className="size-9 shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <UserRound className="size-4" aria-hidden="true" />
              )}
              <span className="text-foreground">{post.author ?? "Skédio"}</span>
            </div>
            <SocialLinks socials={socialsFor(post.author)} />
          </div>
          {/* Date and length are grouped and pushed right with `ml-auto` so they
              sit against the right edge whenever they share a line with the
              author, and stay together on their own right-aligned line when
              narrow widths wrap the byline. `flex-wrap` on the parent handles
              the wrap; `ml-auto` does the right-alignment. */}
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" aria-hidden="true" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
            {post.readingTimeMinutes && (
              <div className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                <span>{post.readingTimeMinutes} min read</span>
              </div>
            )}
            {/* Inside the right-aligned group, last, so the share control sits
                at the end of the row without pushing the date off the edge. */}
            <ShareButton
              url={toAbsoluteUrl(`/blog/${post.slug}`)}
              title={post.title}
              className="shrink-0"
            />
          </div>
        </div>

        {/* Article Body */}
        <div className="prose-skedio mt-12" dangerouslySetInnerHTML={{ __html: html }} />

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

      <ArticleRelatedLinks
        serviceSlug={post.relatedServiceSlug}
        projectSlug={post.relatedProjectSlug}
      />

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
                  <h3 className="font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-2">
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
