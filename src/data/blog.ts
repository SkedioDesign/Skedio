import imgBrand from "@/assets/svc-identity.jpg";
import imgUiUx from "@/assets/svc-uiux.jpg";
import imgDesign from "@/assets/insight-1.jpg";
import { designSystemContent, designSystemFaqs } from "@/data/blog-design-system";
import type { FAQItem } from "@/lib/schema";

export type BlogCategoryColor = "purple" | "orange" | "teal";

export interface BlogPost {
  slug: string;
  title: string;
  previewImage: string;
  content: string;
  images: string[];
  category: string;
  categoryColor?: BlogCategoryColor;
  excerpt: string;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  /** The service this post concerns, for a contextual link. Optional: a post
   *  with no honest service match simply renders no card. */
  relatedServiceSlug?: string;
  /** The project this post is illustrated by. Left unset where no single piece
   *  of work would honestly illustrate the argument. */
  relatedProjectSlug?: string;
  /** Held to the top of the blog regardless of date, and featured on the
   *  homepage. Only one post should set this: the sort below is stable, so two
   *  pinned posts would just pin both, and which one leads would depend on the
   *  order they happen to sit in the array. */
  pinned?: boolean;
  /** Overrides the word-count reading time, which is derived from `content` and
   *  therefore cannot know about a table or a list. Worth setting on a long
   *  post; leaving it unset keeps the derived estimate. */
  readingTimeMinutes?: number;
  /** Emitted as FAQPage JSON-LD alongside the article schema. Google requires
   *  the marked-up answers to be visible on the page, so these must stay in
   *  step with the post's own FAQ section. */
  faqs?: FAQItem[];
  /** Byline shown under the title and used as the Article schema's author.
   *  Defaults to the studio name, which is honest for a post with no named
   *  contributor. */
  author?: string;
}

const rawBlogPosts: BlogPost[] = [
  {
    slug: "what-is-a-design-system-why-startups-need-one",
    title: "What Is a Design System & Why Startups Need One",
    previewImage: imgUiUx,
    content: designSystemContent,
    images: [],
    category: "Design Systems",
    categoryColor: "purple",
    excerpt:
      "A design system is a shared set of tokens, components and rules that keeps your product consistent. Learn what it includes, why startups need one, and how to build it lean.",
    publishedAt: "2026-10-05",
    metaTitle: "What Is a Design System? Why Startups Need One | Skédio",
    metaDescription:
      "A design system is a shared set of tokens, components and rules that keeps your product consistent. Learn what it includes, why startups need one, and how to build it lean.",
    ogImage: "/og.webp",
    relatedServiceSlug: "ui-ux-design",
    relatedProjectSlug: "tiffinly",
    pinned: true,
    readingTimeMinutes: 8,
    faqs: designSystemFaqs,
    // Matches a member name in data/team-socials.json, which is where the
    // article's byline links are read from — one source of truth for who this
    // is and where to find them. A name absent from that file simply renders
    // no icons rather than an empty row.
    author: "Harshita Upadhyay",
  },
  {
    slug: "ai-wont-replace-designers",
    title: "AI Won't Replace Designers. But Designers Who Use AI Will Move Differently.",
    previewImage: imgDesign,
    content:
      "It can help us brainstorm faster, explore more possibilities, generate presentation mockups, and handle repetitive tasks. But we don't outsource the actual design thinking to AI.",
    images: [],
    category: "Design",
    categoryColor: "teal",
    excerpt:
      "AI won't replace designers — but it changes the speed of exploration. How design process evolves.",
    publishedAt: "2026-09-04",
    metaTitle: "AI Won't Replace Designers | Skédio Blog",
    metaDescription:
      "AI won't replace designers — but it changes the speed of exploration. How design process evolves.",
    ogImage: "/og.webp",
    relatedServiceSlug: "ui-ux-design",
  },
  {
    slug: "a-logo-is-not-a-brand",
    title: "A Logo Is Not A Brand",
    previewImage: imgBrand,
    content: "**But a strong brand makes people remember it.**",
    images: [],
    category: "Branding",
    categoryColor: "purple",
    excerpt: "Understanding the difference between a logo and a complete brand system.",
    publishedAt: "2024-01-15",
    metaTitle: "A Logo Is Not A Brand | Skédio Studio",
    metaDescription: "Understanding the difference between a logo and a complete brand system.",
    ogImage: "/og.webp",
    relatedServiceSlug: "brand-identity",
    relatedProjectSlug: "edios",
  },
];

/** Pinned first, then newest first. Sorted here rather than by hand so the order
 *  in the array above is free to change without silently reordering every page
 *  that lists posts.
 *
 *  `Array.prototype.sort` is stable, so posts that tie on both keys keep their
 *  array order — a pinned post stays pinned no matter how the array is edited.
 *  Sorting by date first and pinning second would let a newer post outrank a
 *  pinned one, which is the opposite of what pinning is for. */
export const blogPosts = [...rawBlogPosts].sort((a, b) => {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  return b.publishedAt.localeCompare(a.publishedAt);
});
