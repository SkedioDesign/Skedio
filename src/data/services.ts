export interface ServiceItem {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  definition: string; // Direct quotable one-liner for AEO
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  themeColor: string;
  deliverables: string[];
  process: Array<{ step: string; title: string; description: string }>;
  targetAudience: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const servicesData: ServiceItem[] = [
  {
    slug: "brand-strategy",
    title: "Brand Strategy & Positioning Services",
    shortTitle: "Brand Strategy",
    tagline: "Positioning and strategy that give a brand real direction, not just a look.",
    definition:
      "Brand strategy is the foundational process of defining a business's core positioning, audience segments, competitive advantage, and narrative architecture. Skédio's brand strategy engagements deliver market clarity, positioning frameworks, and actionable roadmaps that guide visual design and product growth.",
    metaTitle: "Brand Strategy & Positioning Agency | Skédio",
    metaDescription:
      "Craft high-impact brand positioning, audience frameworks, and market narratives. Skédio helps ambitious startups and enterprises define their competitive edge.",
    ogImage: "/og-default.png",
    themeColor: "#8537F4",
    deliverables: [
      "Market & Competitor Positioning Matrix",
      "Target Audience & Persona Mapping",
      "Brand Archetype, Voice & Tone Guidelines",
      "Core Value Proposition & Messaging Framework",
      "Brand Architecture & Go-to-Market Narrative",
    ],
    process: [
      {
        step: "01",
        title: "Discovery & Stakeholder Interviews",
        description:
          "We audit your current brand equity, interview leadership, and map market opportunities to uncover untapped positioning whitespace.",
      },
      {
        step: "02",
        title: "Positioning & Value Architecture",
        description:
          "We formulate your strategic wedge — clarifying who you serve, what problem you solve uniquely, and why customers choose you.",
      },
      {
        step: "03",
        title: "Narrative & Messaging Guide",
        description:
          "We translate strategic positioning into clear copywriting guidelines, one-liners, pitch narratives, and brand taglines.",
      },
      {
        step: "04",
        title: "Execution Roadmap",
        description:
          "We deliver a clear implementation plan bridging strategy to visual identity, website copy, product UX, and marketing channels.",
      },
    ],
    targetAudience: [
      "Early-stage startups launching their first commercial product",
      "Scaling companies repositioning for enterprise or international expansion",
      "Established brands undergoing transformation or market expansion",
    ],
    faqs: [
      {
        question: "What is included in a brand strategy engagement?",
        answer:
          "A brand strategy engagement at Skédio includes market research, competitor audits, audience persona formulation, core positioning pillars, voice/tone guidelines, and a complete messaging architecture playbook.",
      },
      {
        question: "How long does a brand strategy project take?",
        answer:
          "A typical brand strategy project takes 2 to 4 weeks depending on company complexity and stakeholder availability.",
      },
      {
        question: "How does brand strategy differ from visual brand identity?",
        answer:
          "Brand strategy defines 'why' you exist, 'who' you serve, and 'what' you say. Visual brand identity translates that strategic foundation into logos, typography, color palettes, and graphic systems.",
      },
    ],
  },
  {
    slug: "brand-identity",
    title: "Brand Identity & Visual Design Studio",
    shortTitle: "Brand Identity",
    tagline:
      "Distinctive visual identities built to be recognized at a glance and remembered long after.",
    definition:
      "Brand identity design is the creation of a unified visual system — including logomarks, typography, color schemes, motion guidelines, and brand design assets. Skédio crafts cohesive visual languages tailored for high-growth digital businesses.",
    metaTitle: "Brand Identity Design Agency | Logo & Visual Systems | Skédio",
    metaDescription:
      "Distinctive logos, typography, color systems, and comprehensive design guidelines crafted for modern brands by Skédio.",
    ogImage: "/og-default.png",
    themeColor: "#8537F4",
    deliverables: [
      "Primary & Secondary Logomarks, Monograms & Favicons",
      "Custom Color Palette & Semantic Color Guidelines",
      "Curated Typography Hierarchy & Font Licensing Guidance",
      "Iconography, Illustration & Graphic Element Kits",
      "Comprehensive Digital & Print Brand Guidelines Book",
    ],
    process: [
      {
        step: "01",
        title: "Moodboarding & Visual Direction",
        description:
          "We explore 2–3 distinct creative directions rooted in your brand strategy, presenting moodboards and style tiles.",
      },
      {
        step: "02",
        title: "Concept Design & Exploration",
        description:
          "We develop the selected direction into fully realized logo concepts, typographic systems, and visual elements.",
      },
      {
        step: "03",
        title: "Real-World Mockups & Stress-Testing",
        description:
          "We test how the identity renders across digital apps, social media, outdoor billboards, packaging, and merchandise.",
      },
      {
        step: "04",
        title: "Brand Design System & Asset Delivery",
        description:
          "We package vector assets, font guides, and comprehensive brand guidelines ensuring smooth handoff and scalable execution.",
      },
    ],
    targetAudience: [
      "Startups needing a credible, memorable identity for fundraising and launch",
      "Consumer and tech companies wanting a modern visual refresh",
      "Digital-first products needing robust visual design systems",
    ],
    faqs: [
      {
        question: "What files and formats do we receive at handoff?",
        answer:
          "You receive vector master files (SVG, EPS, AI), high-res web assets (PNG, WebP), font files/licenses, social media avatar kits, and a complete brand guidelines PDF with digital design tokens.",
      },
      {
        question: "How many design concepts do you present?",
        answer:
          "We typically present 2 to 3 distinct creative concepts during the exploratory phase and iterate on the chosen direction until perfection.",
      },
      {
        question: "How much does brand identity design cost?",
        answer:
          "Brand identity pricing depends on scope, deliverables, and company scale. Contact us for a tailored proposal matching your timeline and milestones.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX & Digital Product Design Agency",
    shortTitle: "UI/UX Design",
    tagline: "Digital experiences built to be intuitive first, beautiful second.",
    definition:
      "UI/UX design is the discipline of researching user behaviors, structuring information architecture, and creating intuitive, aesthetically refined interfaces for web and mobile software. Skédio delivers research-backed user flows, wireframes, interactive prototypes, and production-ready design systems.",
    metaTitle: "UI/UX Design Agency | Web & Mobile Product Design | Skédio",
    metaDescription:
      "Transform complex digital products into intuitive, high-converting web and mobile experiences. Explore Skédio's user-centric UI/UX design services.",
    ogImage: "/og-default.png",
    themeColor: "#8537F4",
    deliverables: [
      "User Journey Mapping & Information Architecture",
      "Low-Fidelity & High-Fidelity Wireframes",
      "Interactive Figma Prototypes & User Testing Sessions",
      "Figma Design Systems with Auto-Layout & Design Tokens",
      "Developer Handoff Specifications & Interaction States",
    ],
    process: [
      {
        step: "01",
        title: "User Research & Flow Architecture",
        description:
          "We analyze user behavior, define core user journeys, and eliminate friction in product architecture.",
      },
      {
        step: "02",
        title: "Wireframing & Structural Prototyping",
        description:
          "We build wireframes mapping every screen state, edge case, modal, and responsive breakpoint.",
      },
      {
        step: "03",
        title: "High-Fidelity Interface Design",
        description:
          "We craft pixel-perfect visual designs infused with typography, subtle motion cues, and high-contrast accessibility.",
      },
      {
        step: "04",
        title: "Design System & Developer Alignment",
        description:
          "We build reusable component libraries and partner closely with engineering teams for zero-loss implementation.",
      },
    ],
    targetAudience: [
      "SaaS and B2B platforms simplifying complex workflows",
      "Mobile applications (iOS & Android) optimizing engagement and retention",
      "E-commerce & marketplace products driving conversion rate improvements",
    ],
    faqs: [
      {
        question: "How long does a UI/UX design project take?",
        answer:
          "A full mobile or web app UI/UX design engagement typically spans 4 to 8 weeks, including research, wireframes, visual design, and interactive prototyping.",
      },
      {
        question: "Do you provide Figma design files and developer handoff?",
        answer:
          "Yes, we provide organized, component-driven Figma files with auto-layout, documented design tokens, interactive prototypes, and developer specs.",
      },
      {
        question: "Can you design for both iOS and Android natively?",
        answer:
          "Yes, our design team adheres to Apple Human Interface Guidelines and Google Material Design specifications to ensure native feel on every device.",
      },
    ],
  },
  {
    slug: "product-development",
    title: "Full-Stack Product & Web Development",
    shortTitle: "Product Development",
    tagline: "End-to-end product development that turns ideas into scalable digital products.",
    definition:
      "Product development is the end-to-end engineering of responsive web applications, mobile apps, and scalable digital architectures. Skédio combines modern frontend technologies (React, Next.js, TanStack Start, TypeScript) with resilient backend architectures to launch performant digital products.",
    metaTitle: "Full-Stack Web & MVP Product Development Studio | Skédio",
    metaDescription:
      "From MVP conception to high-performance web applications. Skédio engineers scalable, fast, and secure digital products for modern companies.",
    ogImage: "/og-default.png",
    themeColor: "#8537F4",
    deliverables: [
      "Modern Web Applications (React, TanStack, Next.js, SSR)",
      "Native & Cross-Platform Mobile Applications",
      "REST & GraphQL API Architecture & Database Schema",
      "Performance & Core Web Vitals Optimization",
      "Continuous Integration & Automated Deployment Pipelines",
    ],
    process: [
      {
        step: "01",
        title: "Technical Architecture & Stack Selection",
        description:
          "We evaluate scale requirements and select the right database, backend, and frontend frameworks.",
      },
      {
        step: "02",
        title: "Agile Sprint Development",
        description:
          "We build in iterative milestones with type-safe code, automated test suites, and staging environments for continuous review.",
      },
      {
        step: "03",
        title: "Quality Assurance & Speed Audits",
        description:
          "We run rigorous accessibility, security, and Core Web Vitals audits ensuring sub-second load times.",
      },
      {
        step: "04",
        title: "Deployment & Scale Support",
        description:
          "We configure edge CDNs, monitoring, logging, and provide ongoing maintenance support post-launch.",
      },
    ],
    targetAudience: [
      "Founders needing to build and launch a high-quality MVP rapidly",
      "Companies rebuilding legacy applications into modern SSR web stacks",
      "Teams seeking a dedicated product engineering partner",
    ],
    faqs: [
      {
        question: "What tech stacks do you specialize in?",
        answer:
          "We specialize in TypeScript, React, TanStack Start, Next.js, Node.js, Tailwind CSS, PostgreSQL, and cloud deployments on Vercel and AWS.",
      },
      {
        question: "Do you offer post-launch support and retainers?",
        answer:
          "Yes, we offer ongoing maintenance, feature iteration, and performance optimization retainers for launched products.",
      },
      {
        question: "Can you take over existing codebases?",
        answer:
          "Yes, we conduct comprehensive code audits and can modernize, refactor, or build on top of existing repositories.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return servicesData.find((s) => s.slug === slug);
}
