import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { blogPosts, type BlogPost } from "@/data/blog";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso?: string) {
  if (!iso || iso.length < 10) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}

function readMinutes(content: string) {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

function CategoryLabel({ category }: { category: string }) {
  return (
    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {category}
    </span>
  );
}

function FeaturedStory({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="group flex flex-col">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="font-serif text-2xl italic leading-none tabular-nums text-muted-foreground/50 md:text-3xl"
        >
          01
        </span>
        <span className="h-px w-10 shrink-0 bg-foreground/15" />
        <CategoryLabel category={post.category} />
        <span className="ml-auto hidden text-xs tracking-[-0.01em] text-muted-foreground sm:block">
          {readMinutes(post.content)} min read
        </span>
      </div>

      <h2 className="mt-6 font-serif text-[clamp(1.875rem,3.2vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.02em] text-balance decoration-primary decoration-2 underline-offset-[6px] underline decoration-transparent transition-[text-decoration-color] duration-300 group-hover:decoration-primary">
        {post.title}
      </h2>

      <p className="mt-5 max-w-[62ch] leading-[1.7] tracking-[-0.01em] text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="mt-9 overflow-hidden">
        <img
          src={post.previewImage}
          alt=""
          className="aspect-[3/2] w-full object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-6 border-t border-foreground/15 pt-5 text-sm">
        <span className="tracking-[-0.01em] text-muted-foreground">{fmtDate(post.publishedAt)}</span>
        <span className="inline-flex items-center gap-2 font-semibold text-primary transition-colors duration-200 group-hover:text-primary-hover">
          Read Article
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
      className="group flex gap-5 py-8 sm:gap-6"
    >
      <div className="shrink-0 self-start overflow-hidden">
        <img
          src={post.previewImage}
          alt=""
          className="aspect-square w-24 object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:w-28"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="font-serif text-sm italic tabular-nums text-muted-foreground/60"
          >
            {index}
          </span>
          <span className="h-px flex-1 bg-foreground/10" />
          <CategoryLabel category={post.category} />
        </div>

        <h3 className="mt-3 font-serif text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-balance decoration-primary decoration-[1.5px] underline-offset-4 underline decoration-transparent transition-[text-decoration-color] duration-300 group-hover:decoration-primary sm:text-lg">
          {post.title}
        </h3>

        <p className="mt-2.5 text-xs tracking-[-0.01em] text-muted-foreground">
          {fmtDate(post.publishedAt)} · {readMinutes(post.content)} min read
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary transition-colors duration-200 group-hover:text-primary-hover">
          Read Article
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function BlogPreview() {
  return (
    <section id="blog" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-24 lg:pb-32">
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Blog</p>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Read our latest thoughts
            </h2>
          </div>
          {blogPosts.length > 3 && (
            <Link
              to="/blog"
              className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-foreground transition-colors duration-250 ease-out hover:border-ink hover:bg-ink hover:text-ink-foreground"
            >
              View All Articles
              <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={1}>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <FeaturedStory post={blogPosts[0]!} />

          {blogPosts.length > 1 && (
            <aside className="divide-y divide-foreground/10 border-t border-foreground/15 lg:pl-16">
              {blogPosts.slice(1).map((post, i) => (
                <ListEntry
                  key={post.slug}
                  post={post}
                  index={String(i + 2).padStart(2, "0")}
                />
              ))}
            </aside>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}