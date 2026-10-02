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

/*
 * ORDER IS EDITORIAL AND LOADS EVERYWHERE. This array is the single source for
 * the "What we do" accordion, the /services hub grid, the homepage hero pills
 * and the numbered 01-04 indices — so reordering here moves all four together.
 *
 * UI/UX Design leads and Website Development follows: they are the two services
 * most visitors arrive looking for, and they read as a natural pair (design the
 * product, then build it), which puts the two craft-led offers ahead of the
 * broader brand and campaign work.
 */
export const servicesData: ServiceItem[] = [
  {
    slug: "ui-ux-design",
    title: "UI/UX Design & Product Strategy Agency",
    shortTitle: "UI/UX Design",
    tagline: "UI/UX design for websites and apps that people enjoy using and come back to.",
    definition:
      "UI/UX design is the end-to-end discipline of turning a business problem into a digital experience people actually want to use. Skédio's engagements span product strategy, discovery research, information architecture, wireframes, interaction design, interactive prototyping, and usability testing — delivered as a validated, launch-ready product and a production-ready design system.",
    metaTitle: "UI/UX Design Agency | Product Design & UX Strategy | Skédio",
    metaDescription:
      "Skédio combines product strategy, user research, and interface design in UI/UX engagements — validated flows, wireframes, and a production-ready design system.",
    ogImage: "/og.webp",
    themeColor: "#8537F4",
    deliverables: [
      "Product Discovery, UX Research & Strategy Sprints",
      "Product Strategy, User Journeys & Information Architecture",
      "Low-Fidelity & High-Fidelity Wireframes",
      "Interactive Figma Prototypes & Usability Testing",
      "Scalable Design Systems, Tokens & Developer Handoff",
    ],
    process: [
      {
        step: "01",
        title: "Discovery & Product Strategy",
        description:
          "We audit the current product, interview stakeholders and real users, then define what the product must do and map the core journeys that make it feel effortless.",
      },
      {
        step: "02",
        title: "Information Architecture & Wireframing",
        description:
          "We structure the flows and information, then build wireframes mapping every screen state, edge case, modal, and responsive breakpoint.",
      },
      {
        step: "03",
        title: "Prototyping & High-Fidelity Interface Design",
        description:
          "We turn flows into interactive prototypes and validate them with users, then craft pixel-perfect visual design with typography, subtle motion cues, and high-contrast accessibility.",
      },
      {
        step: "04",
        title: "Design System & Developer Handoff",
        description:
          "We deliver a reusable design system — tokens, component libraries, interaction states — and align with engineers for a faithful, zero-loss build.",
      },
    ],
    targetAudience: [
      "Startups shaping a new product before a single line of code",
      "SaaS and B2B platforms simplifying complex workflows",
      "Mobile applications (iOS & Android) optimizing engagement and retention",
      "Teams redesigning complex workflows that stall adoption",
    ],
    faqs: [
      {
        question: "What is included in a UI/UX design engagement?",
        answer:
          "A UI/UX design engagement at Skédio includes product discovery and user research, product strategy, journey mapping, information architecture, low- and high-fidelity wireframes, interactive prototypes, usability testing, and a production-ready design system with developer handoff.",
      },
      {
        question: "How long does a UI/UX design project take?",
        answer:
          "A UI/UX design engagement typically spans 4 to 8 weeks depending on product complexity and the number of flows being reworked, covering research, strategy, wireframes, visual design, and interactive prototyping.",
      },
      {
        question: "Can we start a UI/UX engagement before we have a product or customers?",
        answer:
          "Yes. Most of our UI/UX work happens pre-launch: we help founders define the product, pressure-test assumptions with lightweight research, and ship a prototype ready for real users.",
      },
      {
        question: "How do you incorporate user research and usability testing?",
        answer:
          "We run stakeholder interviews, competitor teardowns, and lightweight usability tests on interactive prototypes at key decision points. Findings feed directly into the flows and screens, so the design decisions are based on observed user behavior instead of assumptions.",
      },
      {
        question: "Do you provide Figma design files and developer handoff?",
        answer:
          "Yes, we provide organized, component-driven Figma files with auto-layout, documented design tokens, interactive prototypes, and developer specs.",
      },
      {
        question: "How do you hand off designs to our own engineering team?",
        answer:
          "We hand off component-driven Figma files with auto-layout, documented design tokens, annotated developer specs, and interactive prototypes. We also run an alignment session with your engineers so implementation stays true to the system.",
      },
    ],
  },
  {
    slug: "website-development",
    title: "Custom Website Development Studio",
    shortTitle: "Website Development",
    tagline:
      "Fast, responsive website development that turns your design into a site built to convert.",
    definition:
      "Website development is the engineering of responsive, accessible websites and the digital platforms behind them. Skédio combines modern frontend technologies (React, Next.js, TanStack Start, TypeScript) with resilient backend architectures to ship fast, secure, search-visible sites that hold up under real traffic.",
    metaTitle: "Website Development | Custom Web Design & Build | Skédio",
    metaDescription:
      "From landing pages to full web platforms. Skédio builds fast, accessible, SEO-ready websites with modern React and TypeScript stacks that scale with traffic.",
    ogImage: "/og.webp",
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
      "Teams seeking a dedicated web engineering partner",
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
  {
    slug: "brand-identity",
    title: "Brand Identity & Logo Design Studio",
    shortTitle: "Brand Identity",
    tagline:
      "Logos, color, typography, and guidelines that give your brand a consistent, recognizable identity.",
    definition:
      "Brand identity design is the creation of a unified visual system — including logomarks, typography, color schemes, motion guidelines, and brand design assets. Skédio crafts cohesive visual languages tailored for high-growth digital businesses.",
    metaTitle: "Brand Identity Design | Logo & Visual Systems | Skédio",
    metaDescription:
      "Distinctive logos, typography, color systems, and comprehensive design guidelines crafted for modern brands by Skédio.",
    ogImage: "/og.webp",
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
    slug: "marketing-creatives",
    title: "Marketing Creatives & Content Design",
    shortTitle: "Marketing Creatives",
    tagline:
      "Eye-catching marketing creatives for social, ads, and campaigns that keep your brand on message.",
    definition:
      "Marketing creatives are the repeatable visual and verbal assets a brand publishes D social posts, ad sets, email, print, and landing pages D so that every touchpoint looks like it came from the same studio. Sk—dio builds campaign systems, art direction, and content templates that stay on-brand as the calendar fills up.",
    metaTitle: "Marketing Creatives | Social & Campaign Design | Skédio",
    metaDescription:
      "Marketing creatives that keep one brand voice across social, ads, email, and print — art direction, campaign systems, and on-brand content production.",
    ogImage: "/og.webp",
    themeColor: "#8537F4",
    deliverables: [
      "Campaign Concepts & Art Direction",
      "Social Media Kits, Carousels & Story Templates",
      "Paid Social & Display Ad Creative Sets",
      "Email, Newsletter & Landing Page Design",
      "Brand-Consistent Content Style Guide & Templates",
    ],
    process: [
      {
        step: "01",
        title: "Channel Audit & Creative Strategy",
        description:
          "We map where the brand actually shows up, what is converting, and which assets are missing, then agree the creative direction for the cycle.",
      },
      {
        step: "02",
        title: "Concepting & System Design",
        description:
          "We explore distinct campaign directions, pick one, and build the layout, type, colour, and motion rules that make it repeatable.",
      },
      {
        step: "03",
        title: "Asset Production",
        description:
          "We produce the full set D social cuts, ad variants sized per placement, email art, and landing pages D in every ratio the channels require.",
      },
      {
        step: "04",
        title: "Templates & Handoff",
        description:
          "We deliver editable templates and a style guide so your team can ship on-brand assets between sprints without waiting on us.",
      },
    ],
    targetAudience: [
      "Brands publishing on a calendar they cannot keep up with",
      "Teams whose social and ads stop looking like their own website",
      "Founders who need launch-day creative without hiring in-house",
    ],
    faqs: [
      {
        question: "What is included in a marketing creatives engagement?",
        answer:
          "A marketing creatives engagement includes channel audit, campaign concepting and art direction, social and ad asset production in every required ratio, email and landing page design, and an editable template set with a brand style guide.",
      },
      {
        question: "Do you produce assets in every size each platform needs?",
        answer:
          "Yes. We export each concept across the placements it has to run in D feed, story, reel cover, carousel, display ad widths, and email D rather than one master image stretched to fit.",
      },
      {
        question: "Can we get templates we can use without you?",
        answer:
          "Yes. Every engagement ends with editable Figma and design templates plus a style guide covering type scale, colour, spacing, and do-and-don't examples, so your team can produce assets independently.",
      },
      {
        question: "How long does a creative cycle take?",
        answer:
          "A campaign cycle typically takes 2 to 4 weeks from kickoff to final delivery, depending on how many concepts and how many channel formats are in scope.",
      },
      {
        question: "Will the creative match our existing brand identity?",
        answer:
          "Yes. We work from your established identity D colour, type, and logo rules D and extend it into a campaign system rather than inventing a parallel look that drifts from the site.",
      },
      {
        question: "Do you work alongside our in-house marketing team?",
        answer:
          "Yes. We often act as the creative arm for an in-house team, taking the heavier production and system-building while they own the calendar and the copy.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return servicesData.find((s) => s.slug === slug);
}

/*
 * Resolve a project's `serviceSlugs` to real service records, preserving the
 * authored order and silently dropping slugs with no matching page. The
 * project -> service half of the link graph. Takes slugs rather than reading
 * `projects.ts` directly to keep this module free of a circular import.
 */
export function getServicesBySlugs(slugs: string[]): ServiceItem[] {
  return slugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is ServiceItem => service !== undefined);
}
