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
    slug: "product-design",
    title: "Product Design & UX Strategy Services",
    shortTitle: "Product Design",
    tagline: "Products that feel inevitable — shaped by strategy, research, and tested flows.",
    definition:
      "Product design is the end-to-end discipline of turning a business problem into a digital experience people actually want to use. Skédio's product design engagements span discovery research, product strategy, information architecture, interaction design, interactive prototyping, and usability testing — delivering validated, launch-ready product experiences.",
    metaTitle: "Product Design & UX Strategy Agency | Skédio",
    metaDescription:
      "Take digital products from idea to validated experience. Skédio pairs strategy, user research, and interaction design to craft products people love to use.",
    ogImage: "/og-default.png",
    themeColor: "#8537F4",
    deliverables: [
      "Product Discovery & UX Research Sprints",
      "Product Strategy, Journeys & Information Architecture",
      "Interactive Prototypes & Usability Testing",
      "Interaction Design & Motion Guidelines",
      "Scalable Product Design Systems & Handoff",
    ],
    process: [
      {
        step: "01",
        title: "Discovery & User Research",
        description:
          "We audit your current product, interview stakeholders and real users, and map behavior to the problems actually worth solving.",
      },
      {
        step: "02",
        title: "Product Strategy & Experience Architecture",
        description:
          "We define what the product must do, map core journeys, and architect the flows and information that make it feel effortless.",
      },
      {
        step: "03",
        title: "Prototyping & Iterative Testing",
        description:
          "We turn flows into interactive prototypes and validate them with users, iterating until the experience proves itself.",
      },
      {
        step: "04",
        title: "Interaction Systems & Handoff",
        description:
          "We deliver a reusable product design system — tokens, components, interaction states — and align with engineers for a faithful build.",
      },
    ],
    targetAudience: [
      "Startups shaping a new product before a single line of code",
      "Teams redesigning complex workflows that stall adoption",
      "Companies wanting one partner from product strategy to launch-ready design",
    ],
    faqs: [
      {
        question: "What is included in a product design engagement?",
        answer:
          "A product design engagement at Skédio includes discovery research, product strategy, journey mapping, information architecture, interactive prototypes, usability testing, and a production-ready design system.",
      },
      {
        question: "How long does a product design project take?",
        answer:
          "A scoped product design engagement typically takes 4 to 8 weeks depending on product complexity and the number of flows being reworked.",
      },
      {
        question: "How does product design differ from UI/UX design?",
        answer:
          "Product design owns the strategic layer — research, product thinking, information architecture, prototyping, and validation — that decides what to build and why. UI/UX design crafts the polished interface itself. We often run the two as one continuous engagement.",
      },
      {
        question: "Can we start product design before we have a product or customers?",
        answer:
          "Yes. Most of our product design work happens pre-launch: we help founders define the product, pressure-test assumptions with lightweight research, and ship a prototype ready for real users.",
      },
      {
        question: "How do you design a product in a crowded or commoditized market?",
        answer:
          "Through user research and competitor teardowns, we map where meaningful players fall short, then design the experience wedge your category leaves open — built around a specific job for a specific audience rather than generic 'best-in-class' claims.",
      },
      {
        question: "Do product design recommendations come with an execution roadmap?",
        answer:
          "Yes. Every engagement ends with a clear roadmap that sequences strategy into interface design, development, and launch. We can execute the adjoining work as well if you want a single partner from strategy to shipped product.",
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
          "We explore 2–3 distinct creative directions rooted in your strategic direction, presenting moodboards and style tiles.",
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
      {
        question: "How do you ensure a logo works across apps, packaging, and social media?",
        answer:
          "We stress-test every concept — from a 16px favicon to large-format print — on digital apps, packaging, social avatars, and merchandise before finalizing. You receive flexible lockups, clear-space rules, and responsive variants so the mark stays legible everywhere it appears.",
      },
      {
        question: "Can you adapt an existing identity, or do we need a full redesign?",
        answer:
          "Both paths are covered by the same audit-first process. We assess the equity in your current marks and systems, then recommend a targeted refresh that keeps what works and evolves the rest, or a full redesign when a category reset is what you need.",
      },
      {
        question: "How long does a complete brand identity project take?",
        answer:
          "A full identity project typically takes 3 to 5 weeks, including concept exploration, refinement, real-world mockups, and the final design system and brand guidelines.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX & Digital Product Design Agency",
    shortTitle: "Visual Design",
    tagline: "Digital experiences built to be intuitive first, beautiful second.",
    definition:
      "UI/UX design is the discipline of researching user behaviors, structuring information architecture, and creating intuitive, aesthetically refined interfaces for web and mobile software. Skédio delivers research-backed user flows, wireframes, interactive prototypes, and production-ready design systems.",
    metaTitle: "Visual Design Agency | Web & Mobile Product Design | Skédio",
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
      {
        question: "How do you incorporate user research and usability testing?",
        answer:
          "We run stakeholder interviews, competitor teardowns, and lightweight usability tests on interactive prototypes at key decision points. Findings feed directly into the flows and screens, so the design decisions are based on observed user behavior instead of assumptions.",
      },
      {
        question: "Can you improve the UX of an existing product without a full rebuild?",
        answer:
          "Yes. We start with a UX audit of your current flows, analytics, and fundamentals, then prioritize low-effort, high-impact fixes into iterative design sprints. You see improvements incrementally without pausing development.",
      },
      {
        question: "How do you hand off designs to our own engineering team?",
        answer:
          "We hand off component-driven Figma files with auto-layout, documented design tokens, annotated developer specs, and interactive prototypes. We also run an alignment session with your engineers so implementation stays true to the system.",
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
      {
        question: "How long does it take to build an MVP?",
        answer:
          "A scoped MVP with core features typically takes 6 to 10 weeks, including design and development. Complexity, integrations, and the breadth of the feature set are the main variables — we lock real timing in the proposal after discovery.",
      },
      {
        question: "Do you handle hosting, deployment, and infrastructure?",
        answer:
          "Yes. We configure deployment pipelines, edge CDNs, monitoring, logging, and cloud infrastructure on Vercel or AWS as part of delivery. We also offer ongoing maintenance and security oversight after launch.",
      },
      {
        question: "How do you estimate cost and scope for a development project?",
        answer:
          "We run a discovery and architecture workshop, then break the product into features and effort to produce a phased, milestone-based estimate. You pay per agreed milestone rather than by nebulous hourly effort.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return servicesData.find((s) => s.slug === slug);
}
