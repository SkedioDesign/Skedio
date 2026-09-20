import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { blogPosts, type BlogPost } from "@/data/blog";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: seo({
      title: "Studio Blog | Skédio",
      description:
        "Read our articles on product design, brand identity, and digital product development.",
      url: "/blog",
    }),
    links: [...canonicalLink("/blog")],
  }),
  component: BlogList,
});

const formatDate = (iso: string, month: "long" | "short" = "long") =>
  new Date(iso).toLocaleDateString("en-US", {
    month,
    day: "numeric",
    year: "numeric",
  });

const formatMonthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });

const readMinutes = (content: string) =>
  Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));

function BlogList() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
  ]);

  const stories = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const featured = stories[0]!;
  const rail = stories.slice(1);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData data={breadcrumbs} />

      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium tracking-[-0.01em] text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to Skédio
          </Link>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Skédio — Journal
          </span>
        </div>
      </div>

      {/* Masthead */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pt-12 md:pt-16">
        <div className="border-y border-foreground/10 pb-10 pt-8 md:pb-14 md:pt-12">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8 xl:col-span-7">
              <p className="eyebrow">Skédio Journal</p>
              <h1 className="mt-6 font-serif font-bold leading-[0.95] tracking-[-0.02em] text-[clamp(3.25rem,9vw,6rem)]">
                Blog
              </h1>
              <p className="mt-6 max-w-xl leading-relaxed tracking-[-0.01em] text-muted-foreground md:mt-7">
                Thoughtful analyses, tactical breakdowns, and design philosophies on product design,
                user experience, and digital product development.
              </p>
            </div>
            <ul className="lg:col-span-4 xl:col-span-5">
              <MastheadMeta label="Vol." value="Vol. 01" />
              <MastheadMeta label="Stories" value={String(stories.length).padStart(2, "0")} />
              <MastheadMeta label="Updated" value={formatMonthYear(featured.publishedAt)} />
            </ul>
          </div>
        </div>
      </section>

      {/* Listing */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-24 pt-16 md:pb-32 md:pt-20">
        <div className="grid gap-16 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <FeaturedStory post={featured} />

          <aside className="lg:border-l lg:border-foreground/10 lg:pl-12">
            <div className="divide-y divide-foreground/10">
              {rail.map((post, i) => (
                <ListEntry key={post.slug} post={post} index={String(i + 2).padStart(2, "0")} />
              ))}
            </div>
          </aside>
        </div>

        {/* Colophon */}
        <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/15 pt-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span>Skédio Journal — Vol. 01</span>
          <span>Est. 2024</span>
        </footer>
      </section>
    </main>
  );
}

function MastheadMeta({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-6 border-b border-foreground/10 py-2.5 last:border-b-0 lg:justify-end lg:gap-3 lg:py-3">
      <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold tracking-[-0.01em]">{value}</span>
    </li>
  );
}

function FeaturedStory({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="group flex flex-col">
      <div className="flex items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="font-serif text-2xl italic leading-none tabular-nums text-muted-foreground/50 md:text-3xl"
          >
            01
          </span>
          <span className="h-px w-10 shrink-0 bg-foreground/15" />
          <span className="eyebrow">{post.category}</span>
        </div>
        <span className="hidden text-xs tracking-[-0.01em] text-muted-foreground sm:block">
          {readMinutes(post.content)} min read
        </span>
      </div>

      <h2 className="mt-7 font-serif text-[clamp(1.8rem,3.1vw,2.65rem)] font-bold leading-[1.08] tracking-[-0.02em] text-balance decoration-primary decoration-2 underline-offset-[6px] underline decoration-transparent transition-[text-decoration-color] duration-300 group-hover:decoration-primary">
        {post.title}
      </h2>

      <p className="mt-5 max-w-[62ch] leading-[1.7] tracking-[-0.01em] text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="mt-9 overflow-hidden">
        <img
          src={post.previewImage}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[3/2] w-full object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-foreground/10 pt-5 text-sm">
        <span className="tracking-[-0.01em] text-muted-foreground">
          {formatDate(post.publishedAt)}
        </span>
        <span className="inline-flex items-center gap-2 font-semibold tracking-[-0.01em]">
          Read story
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function ListEntry({ post, index }: { post: BlogPost; index: string }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex gap-5 py-7 first:pt-0 sm:gap-6"
    >
      <div className="shrink-0 overflow-hidden">
        <img
          src={post.previewImage}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-square w-24 object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:w-28"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="font-serif text-sm italic tabular-nums text-muted-foreground/60"
          >
            {index}
          </span>
          <span className="h-px flex-1 bg-foreground/10" />
        </div>
        <h3 className="mt-3 font-serif text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-balance decoration-primary decoration-[1.5px] underline-offset-4 underline decoration-transparent transition-[text-decoration-color] duration-300 group-hover:decoration-primary sm:text-lg">
          {post.title}
        </h3>
        <p className="mt-2.5 text-xs tracking-[-0.01em] text-muted-foreground">
          {formatDate(post.publishedAt, "short")} · {readMinutes(post.content)} min read
        </p>
      </div>
    </Link>
  );
}
