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
}

export const blogPosts: BlogPost[] = [
  {
    slug: "good-ui-isnt-about-making-things-beautiful",
    title: "Good UI Isn't About Making Things Beautiful",
    previewImage: imgUiUx,
    content:
      "# 02. Good UI Isn't About Making Things Beautiful\n\nThere's a common misconception in digital design:\n\n> If an interface looks beautiful, it's good UI.\n\nNot necessarily.\n\nA beautiful interface can still be confusing.\n\nA user shouldn't have to admire your interface to figure out how to use it. The best UI often feels almost invisible because everything appears where the user expects it to be.\n\nThat's where fundamentals matter.\n\n**Typography** creates hierarchy.\n\n**Spacing** creates structure.\n\n**Color** communicates meaning and establishes emphasis.\n\n**Layout** guides attention.\n\n**Components** create consistency.\n\nAnd **interaction design** tells users what happens next.\n\nConsider a simple checkout screen. You could make it visually stunning with gradients, animations, illustrations, and elaborate cards. But if the user can't immediately understand the price, delivery information, or primary CTA, the design has failed its most important job.\n\nGood UI balances **aesthetics with usability**.\n\nAt Skédio, we approach interface design by asking two questions:\n\n**Does it look right?**\n\n**Does it work right?**\n\nThe goal isn't to add more visual elements.\n\nIt's to remove everything that doesn't help the user.\n\nBecause the best interface isn't necessarily the one that gets the most compliments.\n\n**It's the one that makes the user's next decision obvious.**",
    images: [],
    category: "UI/UX",
    categoryColor: "orange",
    excerpt:
      "Great UI isn't about how an interface looks — it's about making the user's next decision obvious.",
    publishedAt: "2026-09-05",
    metaTitle: "Good UI Isn't About Making Things Beautiful | Skédio Blog",
    metaDescription:
      "Great UI isn't about how an interface looks — it's about making the user's next decision obvious.",
    ogImage: "/og-default.png",
  },
  {
    slug: "a-logo-is-not-a-brand",
    title: "A Logo Is Not A Brand",
    previewImage: imgBrand,
    content:
      "# 01. A Logo Is Not a Brand\n\nA logo is often the first thing people ask for when starting a business.\n\n\"Can you design us a logo?\"\n\nIt sounds simple. But a logo is only one small part of what makes a brand recognizable.\n\nBefore drawing a single shape, a brand needs answers to much more important questions:\n\n**Who are you? Who are you speaking to? What do you stand for? How should people feel when they interact with you? And why should they choose you over someone else?**\n\nA logo should come *after* these questions—not before them.\n\nA strong identity is built from a combination of strategy, typography, color, imagery, tone of voice, layout, and consistency. The logo then becomes a visual signature for that entire system.\n\nThink about brands you recognize without even seeing their name. You may identify them through a color, a typeface, a packaging style, an illustration, or even the way their advertisements are composed.\n\nThat's the power of a **brand system**.\n\nAt Skédio, we believe branding isn't about making something that simply looks good. It's about creating an identity that feels intentional, recognizable, and relevant to the people it's designed for.\n\n**Because a logo can identify a business.**\n\n**But a strong brand makes people remember it.**",
    images: [],
    category: "Branding",
    categoryColor: "purple",
    excerpt: "Understanding the difference between a logo and a complete brand system.",
    publishedAt: "2024-01-15",
    metaTitle: "A Logo Is Not A Brand | Skédio Studio",
    metaDescription: "Understanding the difference between a logo and a complete brand system.",
    ogImage: "/og-default.png",
  },
  {
    slug: "ai-wont-replace-designers",
    title: "AI Won't Replace Designers. But Designers Who Use AI Will Move Differently.",
    previewImage: imgDesign,
    content:
      "# 03. AI Won't Replace Designers. But Designers Who Use AI Will Move Differently.\n\nAI has changed the way designers work.\n\nBut I don't think the biggest advantage of AI is that it can generate an image in a few seconds.\n\nThe real advantage is **speed of exploration**.\n\nTraditionally, exploring multiple creative directions could take hours. Today, AI can help designers quickly generate references, mood variations, visual concepts, compositions, and mockups.\n\nA typical workflow might look something like this:\n\n**Idea → References → AI exploration → Selection → Design refinement → Final execution**\n\nThe important part is that AI sits inside the process—not at the center of it.\n\nAt Skédio, we use AI as a **creative accelerator**.\n\nIt can help us brainstorm faster, explore more possibilities, generate presentation mockups, and handle repetitive tasks. But we don't outsource the actual design thinking to AI.",
    images: [],
    category: "Design",
    categoryColor: "teal",
    excerpt:
      "AI won't replace designers — but it changes the speed of exploration. How design process evolves.",
    publishedAt: "2026-09-04",
    metaTitle: "AI Won't Replace Designers | Skédio Blog",
    metaDescription:
      "AI won't replace designers — but it changes the speed of exploration. How design process evolves.",
    ogImage: "/og-default.png",
  },
];
