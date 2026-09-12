import { siteConfig } from "./site-config";
import { insightsArticles } from "../data/insights";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc2822(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date().toUTCString() : parsed.toUTCString();
}

export function generateRssFeedXml(): string {
  const channelLink = `${siteConfig.url}/insights`;
  const feedLink = `${siteConfig.url}/insights/feed.xml`;

  const items = insightsArticles
    .map((article) => {
      const articleUrl = `${siteConfig.url}/insights/${article.slug}`;
      const author = article.author.name;
      const authorEmail = article.author.email || siteConfig.email;

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <author>${escapeXml(authorEmail)} (${escapeXml(author)})</author>
      <pubDate>${escapeXml(toRfc2822(article.datePublished))}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} Insights`)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-US</language>
    <lastBuildDate>${toRfc2822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${escapeXml(feedLink)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}
