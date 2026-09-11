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
    services: ["UI/UX Design", "Brand Strategy", "Product Development"],
  },
];

export function getProjectBySlug(slug: string): ProjectSummary | undefined {
  return projects.find((p) => p.slug === slug);
}
