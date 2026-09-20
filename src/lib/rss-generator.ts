import { siteConfig } from "./site-config";
import { blogPosts, type BlogPost } from "../data/blog";
import { insightsArticles, type InsightArticle } from "../data/insights";

type FeedArticle = BlogPost | InsightArticle;

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

function getAuthor(article: FeedArticle): { name: string; email?: string } {
  if ("author" in article && article.author) {
    return article.author.email
      ? { name: article.author.name, email: article.author.email }
      : { name: article.author.name };
  }
  return { name: siteConfig.name, email: siteConfig.email };
}

function getExcerpt(article: FeedArticle): string {
  if (article.excerpt) {
    return article.excerpt;
  }
  // For blog posts, use the first paragraph or metaDescription
  if ("metaDescription" in article && article.metaDescription) {
    return article.metaDescription;
  }
  return typeof article.content === "string"
    ? article.content.split(" ").slice(0, 50).join(" ") + "..."
    : "";
}

function getPubDate(article: FeedArticle): string {
  if ("datePublished" in article && article.datePublished) {
    return article.datePublished;
  }
  if ("publishedAt" in article && article.publishedAt) {
    return article.publishedAt;
  }
  return new Date().toISOString();
}

export function generateRssFeedXml(): string {
  const channelLink = `${siteConfig.url}/blog`;
  const feedLink = `${siteConfig.url}/blog/feed.xml`;

  const allArticles = [...blogPosts, ...insightsArticles];

  const items = allArticles.map((article) => {
    const articleUrl = `${siteConfig.url}/blog/${article.slug}`;
    const { name, email } = getAuthor(article);
    const excerpt = getExcerpt(article);
    const pubDate = getPubDate(article);

    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(excerpt)}</description>
      <author>${escapeXml(email || siteConfig.email)} (${escapeXml(name)})</author>
      <pubDate>${escapeXml(toRfc2822(pubDate))}</pubDate>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} Blog`)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-US</language>
    <lastBuildDate>${toRfc2822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${escapeXml(feedLink)}" rel="self" type="application/rss+xml" />
  ${items}
  </channel>
</rss>`;
}
