export type ProjectCategory = "UI/UX" | "Branding" | "Social Media" | "Development";
export type ProjectTagColor = "purple" | "orange" | "teal";
export type ProjectCellSize = "hero" | "wide" | "normal";

/*
 * The single source of truth for portfolio projects. One entry per project:
 * full case-study metadata (used by the /projects/[slug] route) plus the
 * bento-grid fields (category, tagColor, size) the SelectedWork section
 * renders from. `published` gates the case-study page — set false until the
 * writeup exists so the route returns a 404 instead of a half-built page.
 */
export interface ProjectSummary {
  slug: string;
  name: string;
  line: string;
  tag: string;
  cover: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  themeColor: string;
  year: string;
  platform: string;
  discipline: string;
  scope: string;
  publishedDate: string;
  client: string;
  summary: string;
  services: string[];
  category: ProjectCategory;
  tagColor: ProjectTagColor;
  size: ProjectCellSize;
  published: boolean;
}

export const projects: ProjectSummary[] = [
  {
    slug: "haocabs",
    name: "HAO Cabs",
    line: "A Taxi Bidding Experience App",
    tag: "Product Design, UI/UX",
    cover: "/HaoCabs/cover.png",
    metaTitle: "HAO Cabs — Taxi Bidding Experience App & UI/UX Case Study | Skédio",
    metaDescription:
      "Explore how Skédio designed HAO Cabs — a real-time taxi bidding and ride-booking mobile application connecting passengers and drivers seamlessly.",
    ogImage: "/HaoCabs/1.jpg",
    themeColor: "#FFC400",
    year: "2026",
    platform: "Mobile App (iOS & Android)",
    discipline: "Product Design & Strategy",
    scope: "UI/UX, Flow Architecture, Design System",
    publishedDate: "2026-01-15",
    client: "HAO Mobility",
    summary:
      "A modern taxi-bidding platform where riders compare driver bids in real time and choose the ride that best fits their budget and schedule.",
    services: ["Visual Design", "Product Design", "Product Development"],
    category: "UI/UX",
    tagColor: "purple",
    size: "hero",
    published: true,
  },
  {
    slug: "edios",
    name: "EDIOS",
    line: "video production studio",
    tag: "Brand Identity, Art Direction",
    cover: "/EDIOS/1.jpg",
    metaTitle: "EDIOS — Video Production Studio Brand Identity | Skédio",
    metaDescription: "Brand identity and art direction for EDIOS, a video production studio.",
    ogImage: "/EDIOS/1.jpg",
    themeColor: "#b61318",
    year: "2026",
    platform: "Brand Identity System",
    discipline: "Branding & Identity",
    scope: "Identity Design, Art Direction, Brand Guidelines",
    publishedDate: "2026-02-10",
    client: "EDIOS",
    summary: "A bold visual identity for EDIOS, a video production studio.",
    services: ["Brand Identity", "Art Direction"],
    category: "Branding",
    tagColor: "orange",
    size: "normal",
    published: true,
  },
];

/* Bento grid shape used by the SelectedWork section — derived from projects. */
export interface SelectedWorkItem {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  tagColor: ProjectTagColor;
  image: string;
  size: ProjectCellSize;
}

export const selectedWork: SelectedWorkItem[] = projects.map((p) => ({
  slug: p.slug,
  title: p.name,
  subtitle: p.line,
  category: p.category,
  tagColor: p.tagColor,
  image: p.cover,
  size: p.size,
}));

export function getProjectBySlug(slug: string): ProjectSummary | undefined {
  return projects.find((p) => p.slug === slug);
}
