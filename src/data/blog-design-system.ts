import type { FAQItem } from "@/lib/schema";

/**
 * Body copy for the design-system article, kept out of `blog.ts` because it is
 * roughly ten times the length of any other post and inlining it there pushed
 * the post list past a screen and a half.
 *
 * Markdown, not JSX: `renderMarkdown` escapes the source before parsing, so the
 * tables, emphasis and lists below are rendered by `marked` and cannot inject
 * markup. The trade is that this file is not type-checked as markup — the
 * section headings have to match the TOC anchors by hand.
 */
export const designSystemContent = `**A design system is a single source of truth for how your product looks, feels and is built.** It combines design tokens, reusable components, usage patterns and documentation, so designers and developers stop reinventing the same button for the tenth time.

If you are a founder shipping fast, this might sound like "big company stuff." It isn't. The right-sized design system is one of the cheapest ways to look more professional, ship faster and avoid expensive redesigns later.

At **Skédio**, a creative design studio, we build lean design systems for startups every day. This guide explains what a design system is, what goes inside, why it matters, and *when* it's worth building.

---

## Table of Contents

1. [What is a design system?](#what-is-a-design-system)
2. [What does a design system include?](#what-does-a-design-system-include)
3. [Design system vs style guide vs component library](#design-system-vs-style-guide-vs-component-library)
4. [Why startups need a design system](#why-startups-need-a-design-system)
5. [When is it too early?](#when-is-it-too-early-for-a-design-system)
6. [How to build a startup design system (step by step)](#how-to-build-a-startup-design-system-step-by-step)
7. [Famous design system examples](#famous-design-system-examples)
8. [Common mistakes](#common-design-system-mistakes)
9. [FAQ](#faq)

---

## What Is a Design System?

A **design system** is a collection of reusable building blocks, clear standards and shared documentation that keeps a digital product consistent as it grows.

Think of it as your product's **operating system for design**:

- **Designers** pull ready-made components instead of drawing from scratch.
- **Developers** build from the same named values and components.
- **Founders and PMs** get a product that feels cohesive on every screen.

It's not a logo file, a Figma page full of colors, or a pretty PDF. It's a *living* system that evolves with your product.

---

## What Does a Design System Include?

Most mature design systems stack four layers:

| Layer | What it is | Example |
|---|---|---|
| **Design tokens** | Named values for design decisions | \`color-primary\`, \`space-16\`, \`radius-md\` |
| **Component library** | Reusable UI pieces, in Figma and in code | Buttons, inputs, cards, modals, nav |
| **Patterns** | How components combine to solve problems | Sign-up flow, empty states, forms, error handling |
| **Documentation** | Rules for using it all well | When to use a primary vs secondary button |

### Design tokens (the foundation)

**Design tokens** are the smallest reusable decisions in your system: colors, type sizes, spacing, radii, shadows. Instead of hard-coding \`#4F46E5\` in forty places, you reference one named token. Change it once, and it updates everywhere.

A simple two-tier setup works well for startups:

- **Primitive tokens:** raw values, e.g. \`blue-500\`
- **Semantic tokens:** meaning-based names, e.g. \`color-action-primary\`, which point to a primitive

Semantic names make dark mode, theming and rebrands dramatically easier.

### Component library

A **component library** is the set of reusable UI elements. In a good setup, the Figma component and the coded component share the same name and behavior, so handoff stops being a guessing game. Use Figma variants for states (default, hover, active, disabled, error) rather than separate components.

### Patterns and documentation

Patterns show how pieces work together; documentation explains the "why" and the "when not to." The second question matters: knowing when *not* to use a component prevents most inconsistency.

---

## Design System vs Style Guide vs Component Library

These three terms get mixed up constantly:

| | **Style guide** | **Component library** | **Design system** |
|---|---|---|---|
| **What it is** | Documentation of visual rules | Packaged, reusable UI code/components | The governed whole that connects both |
| **Covers** | Colors, type, logo, tone | Buttons, forms, layouts | Tokens, components, patterns, docs, governance |
| **Best for** | Brand consistency | Faster front-end builds | Scaling product teams |
| **Effort** | Low | Medium | Medium to high |

**Rule of thumb:** a style guide *documents* decisions, a component library *packages* them, and a design system *governs and connects* everything. A style guide is one piece of a design system, not a replacement for it.

---

## Why Startups Need a Design System

Startups move fast, and fast without structure creates design debt. Here's what a design system gives you.

### 1. Ship faster

Reusable components mean new screens are *assembled*, not designed from zero. Teams routinely cut design-to-dev time because the decisions are already made.

### 2. Look consistent and credible

Users judge trust in seconds. Mismatched buttons, random spacing and inconsistent fonts quietly signal "unfinished." A system makes a small team look polished.

### 3. Reduce design and engineering rework

Without shared components, teams end up designing and coding multiple versions of the same element. That leads to wasted time and messy code.

### 4. Make handoff painless

When Figma tokens and components map to code variables and component names, developers stop asking "what's the exact padding here?"

### 5. Onboard new hires and freelancers faster

A new designer or developer can contribute on day one because the rules are written down.

### 6. Scale across platforms

Launching a mobile app or second product? Shared tokens let web and mobile stay aligned without a redesign.

### 7. Build accessibility in from the start

When contrast ratios, focus states and touch targets are baked into components, every screen inherits accessibility instead of retrofitting it later.

### 8. Make your brand easier to evolve

Rebrand or add dark mode? With semantic tokens, it's a configuration change, not a rebuild.

---

## When Is It Too Early for a Design System?

Honest answer: **not every startup needs a full custom design system on day one.**

If you're still searching for product-market fit and the product changes weekly, a heavy upfront system can become wasted effort. For very early teams, a lean approach is usually the smarter move:

- A single well-organized Figma file
- A short style guide with core tokens
- An off-the-shelf component library as a base

**Signs it's time to level up:**

- More than one designer or developer touches the UI
- You're building a second product, platform or major feature set
- Screens look slightly different everywhere
- Design-to-dev handoff keeps causing rework
- You're about to scale the team or raise funding

The goal isn't to copy Google's scale. It's to build **just enough system** for where you are.

---

## How to Build a Startup Design System (Step by Step)

### Step 1: Audit what you already have

Screenshot every screen. Group the buttons, colors, fonts and spacing you've actually used. You'll find duplicates and inconsistencies fast.

### Step 2: Define your tokens

Set up the essentials:

- **Color:** 5-7 base colors with tonal scales, mapped to semantic roles
- **Typography:** a type scale with defined roles (heading, body, caption)
- **Spacing:** a consistent grid, commonly 4px or 8px
- **Radius, shadow and motion:** a small, fixed set

### Step 3: Build your core components first

Start with the 10-15 components you use most: buttons, inputs, selects, checkboxes, cards, modals, navigation, alerts, tabs. Don't build a 200-component library you'll never use.

### Step 4: Set up the system in Figma

- Use **Figma Variables** for tokens
- Use **variants** for component states
- Name layers to match your code component names
- Link components to the library (pasting a copy stops it receiving updates)

### Step 5: Connect design to code

Sync tokens to code variables (CSS custom properties or a token tool), and build matching coded components. A Figma library with no coded counterpart is really just a UI kit.

### Step 6: Document the essentials

For each component: when to use it, when *not* to, states, and accessibility notes.

### Step 7: Assign ownership and governance

Even one person as the "design system owner" is enough. Add a simple process for proposing new components so you avoid parallel, duplicate versions.

### Step 8: Review regularly

Treat it like a product. Review quarterly, retire unused components and fix drift between Figma and code.

---

## Famous Design System Examples

Study these to learn how the best teams think:

- **Material Design** (Google): comprehensive guidelines plus components
- **Carbon** (IBM): open source, token-driven, strong accessibility
- **Polaris** (Shopify): tokens, Figma library and code packages aligned
- **Atlassian Design System**: deep documentation and patterns
- **Airbnb DLS**: a design language shared across web and mobile

You don't need their scale, but you can borrow their principles: semantic naming, shared tokens, and docs that explain intent.

---

## Common Design System Mistakes

1. **Building too much, too early.** A giant library for a product that keeps pivoting becomes shelfware.
2. **Making it a "side project."** Without an owner and time, it decays.
3. **Figma-only systems.** If code doesn't match design, engineers will build their own versions.
4. **Skipping documentation.** Components without usage rules get misused.
5. **Naming by value, not role.** \`blue-500\` everywhere makes rebrands painful; use semantic names.
6. **No governance.** Anyone adding components freely leads to chaos.
7. **Ignoring accessibility.** Fixing contrast and focus states later costs far more.

---

## How Skédio Helps Startups Build Design Systems

At **Skédio**, we don't sell bloated systems. We build **right-sized design systems** that match your stage:

- **Design system audits** to find inconsistencies and quick wins
- **Lean design systems** for early-stage startups: tokens, core components and docs
- **Figma libraries** built with variables, variants and clean naming
- **Brand and UI/UX design** that plugs straight into your system
- **Developer-ready handoff** so your engineers ship faster

Ready to make your product look and scale like a pro? Get in touch and we'll map out the right scope for your stage.

---

## FAQ

### What is a design system in simple words?

A design system is a shared toolkit of colors, fonts, spacing, reusable components and rules that keeps a product's design consistent and speeds up design and development.

### Why do startups need a design system?

It helps startups ship faster, look consistent and professional, reduce rework, onboard people quickly and scale to new platforms without redesigning from scratch.

### What is the difference between a design system and a style guide?

A style guide documents visual rules like colors, typography and logo usage. A design system includes the style guide plus reusable components, design tokens, patterns, code and governance.

### What are design tokens?

Design tokens are named values for design decisions, such as colors, spacing and font sizes, that can be reused across design files and code so changes update everywhere at once.

### When should a startup build a design system?

When more than one person works on the UI, when you're adding products or platforms, or when inconsistency and rework start slowing you down. Before that, a lean style guide and an existing component library are often enough.

### How long does it take to build a design system?

A lean starter system (tokens plus 10-15 core components) can come together in a few weeks. A full, multi-product system is an ongoing effort that grows with your product.

### Do I need Figma to build a design system?

Figma is the most common tool because of Variables, variants and shared libraries, but the principles apply to any design tool. What matters is that design and code stay in sync.

### How much does a design system cost?

It depends on scope. A lean startup system costs far less than an enterprise one, and building only what you need keeps the investment low and the payoff high.

---

## Key Takeaways

- A design system = **tokens + components + patterns + documentation**.
- It's more than a style guide or a Figma file.
- It helps startups **ship faster, stay consistent and scale**.
- Don't over-build early: start lean, grow with the product.
- Keep Figma and code in sync, and assign an owner.
`;

/**
 * The FAQ answers, kept in step with the FAQ section above by hand so the
 * FAQPage JSON-LD describes exactly what the article says. Google requires the
 * marked-up content to be visible on the page; a schema that drifts from the
 * copy risks a manual action rather than a rich result.
 *
 * `getFAQSchema` folds each answer's `bullets` and `closing` into the single
 * string schema.org accepts, so those fields stay useful for the accordion
 * without changing the structured data.
 */
export const designSystemFaqs: FAQItem[] = [
  {
    question: "What is a design system in simple words?",
    answer:
      "A design system is a shared toolkit of colors, fonts, spacing, reusable components and rules that keeps a product's design consistent and speeds up design and development.",
  },
  {
    question: "Why do startups need a design system?",
    answer:
      "It helps startups ship faster, look consistent and professional, reduce rework, onboard people quickly and scale to new platforms without redesigning from scratch.",
  },
  {
    question: "What is the difference between a design system and a style guide?",
    answer:
      "A style guide documents visual rules like colors, typography and logo usage. A design system includes the style guide plus reusable components, design tokens, patterns, code and governance.",
  },
  {
    question: "What are design tokens?",
    answer:
      "Design tokens are named values for design decisions, such as colors, spacing and font sizes, that can be reused across design files and code so changes update everywhere at once.",
  },
  {
    question: "When should a startup build a design system?",
    answer:
      "When more than one person works on the UI, when you're adding products or platforms, or when inconsistency and rework start slowing you down. Before that, a lean style guide and an existing component library are often enough.",
  },
  {
    question: "How long does it take to build a design system?",
    answer:
      "A lean starter system (tokens plus 10-15 core components) can come together in a few weeks. A full, multi-product system is an ongoing effort that grows with your product.",
  },
  {
    question: "Do I need Figma to build a design system?",
    answer:
      "Figma is the most common tool because of Variables, variants and shared libraries, but the principles apply to any design tool. What matters is that design and code stay in sync.",
  },
  {
    question: "How much does a design system cost?",
    answer:
      "It depends on scope. A lean startup system costs far less than an enterprise one, and building only what you need keeps the investment low and the payoff high.",
  },
];
