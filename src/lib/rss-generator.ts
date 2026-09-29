import { siteConfig } from "./site-config";
import { blogPosts, type BlogPost } from "../data/blog";
import { insightsArticles, type InsightArticle } from "../data/insights";

/**
 * Each editorial stream gets its own feed. They are deliberately NOT merged:
 * a single combined feed forced every item to share one channel path, which
 * meant insights articles were published under /blog/<slug> URLs that 404
 * (blogPosts has no matching slug), and /insights/feed.xml advertised itself
 * as "Skédio Blog".
 */
export type FeedSource = "blog" | "insights";

interface FeedConfig {
  channelTitle: string;
  channelDescription: string;
  /** Human-facing page the channel links to. */
  channelPath: string;
  /** This feed's own canonical URL (rel="self"). */
  feedPath: string;
}

const feedConfigs: Record<FeedSource, FeedConfig> = {
  blog: {
    channelTitle: "Skédio Blog",
    channelDescription:
      "Articles on product design, brand identity, and digital product development from the Skedio studio.",
    channelPath: "/blog",
    feedPath: "/blog/feed.xml",
  },
  insights: {
    channelTitle: "Skédio Insights",
    channelDescription:
      "Strategic essays on brand building, user experience, and modern web architecture from the Skedio studio.",
    channelPath: "/insights",
    feedPath: "/insights/feed.xml",
  },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toRfc2822(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date().toUTCString() : parsed.toUTCString();
}

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`;
}

interface FeedItem {
  title: string;
  link: string;
  description: string;
  /** RFC 2822 date string. */
  pubDate: string;
  authorEmail: string;
  authorName: string;
  categories: string[];
}

function blogItems(): FeedItem[] {
  return [...blogPosts]
    .sort((a: BlogPost, b: BlogPost) => b.publishedAt.localeCompare(a.publishedAt))
    .map((post) => ({
      title: post.title,
      link: absolute(`/blog/${post.slug}`),
      description: post.excerpt || post.metaDescription,
      pubDate: toRfc2822(post.publishedAt),
      authorEmail: siteConfig.email,
      authorName: siteConfig.name,
      categories: [post.category],
    }));
}

function insightItems(): FeedItem[] {
  return [...insightsArticles]
    .sort((a: InsightArticle, b: InsightArticle) => b.datePublished.localeCompare(a.datePublished))
    .map((article) => ({
      title: article.title,
      link: absolute(`/insights/${article.slug}`),
      description: article.excerpt,
      pubDate: toRfc2822(article.datePublished),
      authorEmail: article.author.email || siteConfig.email,
      authorName: article.author.name,
      categories: article.tags,
    }));
}

export function generateRssFeedXml(source: FeedSource): string {
  const config = feedConfigs[source];
  const items = source === "blog" ? blogItems() : insightItems();

  const renderedItems = items
    .map((item) => {
      const categories = item.categories
        .filter(Boolean)
        .map((c) => `      <category>${escapeXml(c)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <description>${escapeXml(item.description)}</description>
      <author>${escapeXml(item.authorEmail)} (${escapeXml(item.authorName)})</author>
      <pubDate>${escapeXml(item.pubDate)}</pubDate>
${categories}
    </item>`;
    })
    // join("") — NOT bare interpolation. Interpolating the array directly
    // stringifies it with "," separators, injecting literal commas as text
    // nodes between <item> elements (invalid per the RSS 2.0 spec).
    .join("\n");

  // Newest item rather than `new Date()`, so the feed has a stable build date
  // instead of claiming it changed on every single request.
  const lastBuildDate = items.length > 0 ? items[0]!.pubDate : toRfc2822("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.channelTitle)}</title>
    <link>${escapeXml(absolute(config.channelPath))}</link>
    <description>${escapeXml(config.channelDescription)}</description>
    <language>en-US</language>
    <ttl>60</ttl>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    <atom:link href="${escapeXml(absolute(config.feedPath))}" rel="self" type="application/rss+xml" />
${renderedItems}
  </channel>
</rss>`;
}
