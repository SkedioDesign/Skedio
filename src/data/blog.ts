import imgBrand from "@/assets/svc-identity.jpg";
import imgDesign from "@/assets/insight-1.jpg";
import { designSystemContent, designSystemFaqs } from "@/data/blog-design-system";
import { webAppVsWebsiteContent, webAppVsWebsiteFaqs } from "@/data/blog-web-app-vs-website";
import type { FAQItem } from "@/lib/schema";

export type BlogCategoryColor = "purple" | "orange" | "teal";

export interface BlogPost {
  slug: string;
  title: string;
  previewImage: string;
  /** Text alternative for `previewImage`. Defaults to the post title in the
   *  card components, which is honest but only repeats the headline beside it.
   *  Worth setting on posts whose artwork carries meaning of its own — an
   *  illustration earns a description that names what it shows. */
  previewAlt?: string;
  content: string;
  images: string[];
  category: string;
  categoryColor?: BlogCategoryColor;
  excerpt: string;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  /** Intrinsic pixel size of `ogImage`, emitted as og:image:width/height.
   *  Only needed when the card is not the site default /og.webp, whose measured
   *  size is already the seo() default. Declaring the wrong pair misleads a
   *  crawler about the card's aspect ratio, so set both or neither. */
  ogImageWidth?: number;
  ogImageHeight?: number;
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
    slug: "custom-web-app-or-website-which-do-you-need",
    title: "Do You Need a Custom Web App or Just a Website?",
    previewImage: "/ProductDevelopment-768.jpg",
    content: webAppVsWebsiteContent,
    images: [],
    category: "Web Development",
    categoryColor: "orange",
    excerpt:
      "Website or web app? The key differences, rough costs, SEO impact and a 10-question checklist to decide what your business actually needs before you build.",
    publishedAt: "2026-10-06",
    metaTitle: "Custom Web App or Website? How to Choose in 2026 | Skédio",
    metaDescription:
      "Website or web app? Learn the key differences, costs, SEO impact and a simple checklist to decide what your business actually needs before you build.",
    ogImage: "/og.webp",
    relatedServiceSlug: "website-development",
    relatedProjectSlug: "tiffinly",
    readingTimeMinutes: 9,
    faqs: webAppVsWebsiteFaqs,
    // Matches a member name in data/team-socials.json, which is where the
    // article's byline links and photo are read from — one source of truth
    // for who this is and where to find them.
    author: "Aman Raj",
  },
  {
    slug: "what-is-a-design-system-why-startups-need-one",
    title: "What Is a Design System & Why Startups Need One",
    // Self-hosted, and padded to a SQUARE by scripts/pad-design-system-hero.mjs
    // (master art: src/assets/design-system-101-hero.png). Two reasons it is
    // not the original 1672x941 file:
    //  - it was hotlinked from i.ibb.co, which the browser blocked: the CSP
    //    allows `img-src 'self'` only (see server.ts), so a third-party origin
    //    never renders;
    //  - every surface renders it with `object-cover` in a different box (3:2
    //    featured card, 1:1 list thumbnails, 1.91:1 social crop), and a wide
    //    source loses its sides in all three. A square is the one shape each
    //    window shows whole. The pad reuses the art's own edge rows, and the
    //    script fails if a future export would be clipped by any of them.
    previewImage: "/DesignSystem-101-Hero-Illustration.png",
    previewAlt:
      "Design system 101 illustration showing design tokens, reusable UI components, and documentation for building consistent digital products",
    content: designSystemContent,
    images: [],
    category: "Design Systems",
    categoryColor: "purple",
    excerpt:
      "A design system is a shared set of tokens, components and rules that keeps your product consistent. Learn what it includes, why startups need one, and how to build it lean.",
    publishedAt: "2026-10-05",
    metaTitle: "What Is a Design System? Why Startups Need One | Skédio",
    // Trimmed to fit the 160-char meta description cap. The excerpt
    // above keeps the fuller phrasing, since it renders as body copy in
    // listings rather than being cut off mid-sentence in search results.
    metaDescription:
      "A design system is a shared set of tokens, components and rules that keeps a product consistent. Learn why startups need one and how to build it lean.",
    ogImage: "/DesignSystem-101-Hero-Illustration.png",
    // Measured from the file above (square, 1600x1600 — sized to stay at or
    // under the optimizer's MAX_DIMENSION so the build never resizes it and
    // these two numbers stay true) rather than left to the site default,
    // which is sized for /og.webp and would declare a different aspect ratio.
    ogImageWidth: 1600,
    ogImageHeight: 1600,
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
