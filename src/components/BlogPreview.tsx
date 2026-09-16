import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { blogPosts, type BlogPost, type BlogCategoryColor } from "@/data/blog";

const badgeColors: Record<BlogCategoryColor, string> = {
  purple: "bg-primary",
  orange: "bg-[#f97316]",
  teal: "bg-[#0d9488]",
};

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl sm:aspect-[16/9]">
        <img
          src={post.previewImage}
          alt={post.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent"
        />
        {post.category && (
          <span
            className={cn(
              "absolute bottom-3 left-3 inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white",
              badgeColors[post.categoryColor ?? "purple"],
            )}
          >
            {post.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="type-caption text-muted-foreground">{post.publishedAt}</p>
        <h3 className="mt-2 line-clamp-2 font-display text-xl font-extrabold tracking-tight leading-snug transition-colors duration-200 ease-out group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-primary">
          Read Article
          <ArrowRight className="size-3.5 transition-transform duration-250 ease-out group-hover:translate-x-1" />
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

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {blogPosts.slice(0, 3).map((post, idx) => (
          <ScrollReveal key={post.slug} delay={idx % 3} className="h-full">
            <BlogCard post={post} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
