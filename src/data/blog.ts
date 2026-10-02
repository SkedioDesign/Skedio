import imgBrand from "@/assets/svc-identity.jpg";
import imgUiUx from "@/assets/svc-uiux.jpg";
import imgDesign from "@/assets/insight-1.jpg";

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
}

const rawBlogPosts: BlogPost[] = [
  {
    slug: "good-ui-isnt-about-making-things-beautiful",
    title: "Good UI Isn't About Making Things Beautiful",
    previewImage: imgUiUx,
    content: "**It's the one that makes the user's next decision obvious.**",
    images: [],
    category: "UI/UX",
    categoryColor: "orange",
    excerpt:
      "Great UI isn't about how an interface looks — it's about making the user's next decision obvious.",
    publishedAt: "2026-09-05",
    metaTitle: "Good UI Isn't About Making Things Beautiful | Skédio Blog",
    metaDescription:
      "Great UI isn't about how an interface looks — it's about making the user's next decision obvious.",
    ogImage: "/og.webp",
    relatedServiceSlug: "ui-ux-design",
    relatedProjectSlug: "tiffinly",
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

/** Newest first. Sorted here rather than by hand so the order in the array above
 *  is free to change without silently reordering every page that lists posts. */
export const blogPosts = [...rawBlogPosts].sort(
  (a, b) => b.publishedAt.localeCompare(a.publishedAt),
);
