export interface InsightArticle {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  datePublished: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
    email?: string;
  };
  tags: string[];
  content: Array<{
    heading?: string;
    paragraphs: string[];
  }>;
  relatedServiceSlug?: string;
}

export const insightsArticles: InsightArticle[] = [
  {
    slug: "future-of-brand-building-digital-world",
    title: "The Future of Brand Building in an AI and Digital-First Era",
    excerpt:
      "Why distinct brand personality, opinionated positioning, and emotional resonance matter more than ever in an era of AI-generated homogeneity.",
    coverImage: "/og-default.png",
    datePublished: "2026-02-18",
    readingTime: "5 min read",
    author: {
      name: "Aakash Choudhary",
      role: "Founder, Skédio",
      avatar: "/aakash.jpeg",
    },
    tags: ["Product Design", "AI", "Design Trends"],
    relatedServiceSlug: "product-design",
    content: [
      {
        heading: "The Commoditization of the Generic",
        paragraphs: [
          "As generative AI makes generic imagery and cookie-cutter layouts effortless to produce, the baseline standard for visual execution has shifted. What used to take days now takes seconds. But this creates an unexpected paradox: when everything looks polished, nothing stands out.",
          "Brands that rely on bland corporate tropes and predictable aesthetics are rapidly fading into background noise. True brand equity is no longer measured solely by visual cleanliness; it is defined by point of view, strategic tension, and distinctive brand codes.",
        ],
      },
      {
        heading: "Positioning as a Filter, Not Just a Net",
        paragraphs: [
          "Effective brand positioning isn't about appealing to everyone; it's about being undeniably compelling to your ideal customer while deliberately filtering out the rest. When Skédio works with founders to define their position in the market, we focus on identifying the non-negotiable belief that sets the company apart from competitors.",
          "When your positioning is sharp, visual identity decisions become straightforward. Color choices, typography pairings, and micro-copy are all grounded in an authentic strategic narrative rather than transient design fads.",
        ],
      },
      {
        heading: "The Multi-Surface Brand System",
        paragraphs: [
          "Modern brands do not live on billboard print alone. They live across mobile app icons, dark-mode interfaces, social carousels, investor pitch decks, and AI answer engine summaries. A robust brand system must adapt fluidly without losing its core signature.",
        ],
      },
    ],
  },
  {
    slug: "designing-real-time-bidding-marketplace-ux",
    title: "Designing Fast, Trustworthy UX for Real-Time Bidding Marketplaces",
    excerpt:
      "Key lessons from designing HAO Cabs: how to reduce cognitive friction in dual-sided real-time marketplace applications.",
    coverImage: "/HaoCabs/1.jpg",
    datePublished: "2026-01-28",
    readingTime: "6 min read",
    author: {
      name: "Harshita Upadhyay",
      role: "UI/UX Lead, Skédio",
      avatar: "/harshita.jpeg",
    },
    tags: ["UI/UX", "Case Study", "Product Design"],
    relatedServiceSlug: "ui-ux-design",
    content: [
      {
        heading: "The Dual-Sided Marketplace Dilemma",
        paragraphs: [
          "In traditional ride-hailing apps, algorithmic pricing dictates the fare. In a bidding marketplace like HAO Cabs, the dynamics are radically different: riders set their price expectations, and nearby drivers submit counter-bids in real time.",
          "This model introduces choice and fairness, but it also risks introducing decision fatigue. If a passenger has to compare five complex bids while standing in the rain, the UX has failed them.",
        ],
      },
      {
        heading: "Hierarchy of Information Under Time Pressure",
        paragraphs: [
          "When designing the driver bid cards for HAO Cabs, we tested multiple hierarchy layouts. We discovered that three variables dominate user decision-making: ETA to pickup, price difference, and driver rating.",
          "By elevating these three data points into an instant glanceable card and muting auxiliary details until expansion, riders were able to evaluate and accept bids in under 4 seconds on average.",
        ],
      },
      {
        heading: "Micro-Interactions That Build Trust",
        paragraphs: [
          "In real-time platforms, latency can easily feel like a broken connection. We designed pulsing radar waves, subtle haptic confirmations, and live countdown timers so both riders and drivers always know the exact state of their request.",
        ],
      },
    ],
  },
  {
    slug: "typography-in-branding-more-than-just-fonts",
    title: "Typography in Modern Branding: Voice, Scale, and Digital Legibility",
    excerpt:
      "How intentional typographic hierarchies build recognition, convey prestige, and ensure readability across responsive screens.",
    coverImage: "/og-default.png",
    datePublished: "2026-01-10",
    readingTime: "4 min read",
    author: {
      name: "Shrishti Kori",
      role: "Graphics Lead, Skédio",
    },
    tags: ["Brand Identity", "Typography", "Visual Design"],
    relatedServiceSlug: "brand-identity",
    content: [
      {
        heading: "Type as the Foundation of Voice",
        paragraphs: [
          "Typography is the tone of voice before a single word is read. A heavy geometric sans conveys bold confidence; a refined high-contrast serif communicates editorial sophistication; an expressive display typeface signals counter-culture creativity.",
          "Selecting brand typefaces is never just about aesthetics — it is an exercise in brand psychology and technical durability.",
        ],
      },
      {
        heading: "Web Performance and Font Optimization",
        paragraphs: [
          "In high-performance web development, font loading directly dictates Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS). Using modern WOFF2 formats, variable font axes, and aggressive preloading ensures brand typography renders instantly without layout jarring.",
        ],
      },
    ],
  },
];

export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return insightsArticles.find((a) => a.slug === slug);
}
