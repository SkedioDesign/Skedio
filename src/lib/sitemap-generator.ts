import { siteConfig } from "./site-config";
import { projects } from "../data/projects";
import { servicesData } from "../data/services";
import { blogPosts } from "../data/blog";
import { insightsArticles } from "../data/insights";

/**
 * URL convention: NO trailing slash, except the site root which is exactly
 * siteConfig.url + "/". This is already enforced by the router, which
 * 307-redirects "/about/" -> "/about" (verified), so it must be mirrored here
 * or crawlers see two URL forms per page.
 *
 * Keep every <loc> byte-identical to the page's own <link rel="canonical">,
 * which lib/seo.ts builds the same way.
 */
export function generateSitemapXml(): string {
  const currentDate = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    { path: "/", changefreq: "weekly", priority: "1.0", lastmod: currentDate },
    { path: "/services", changefreq: "monthly", priority: "0.9", lastmod: currentDate },
    { path: "/projects", changefreq: "weekly", priority: "0.9", lastmod: currentDate },
    { path: "/about", changefreq: "monthly", priority: "0.8", lastmod: currentDate },
    { path: "/insights", changefreq: "weekly", priority: "0.8", lastmod: currentDate },
    { path: "/blog", changefreq: "weekly", priority: "0.8", lastmod: currentDate },
    { path: "/contact", changefreq: "monthly", priority: "0.9", lastmod: currentDate },
    { path: "/privacy", changefreq: "yearly", priority: "0.3", lastmod: currentDate },
    { path: "/terms", changefreq: "yearly", priority: "0.3", lastmod: currentDate },
  ];

  const serviceRoutes = servicesData.map((s) => ({
    path: `/services/${s.slug}`,
    changefreq: "monthly",
    priority: "0.9",
    lastmod: currentDate,
  }));

  const projectRoutes = projects
    .filter((p) => p.published)
    .map((p) => ({
      path: `/projects/${p.slug}`,
      changefreq: "monthly",
      priority: "0.9",
      lastmod: p.publishedDate || currentDate,
    }));

  const insightRoutes = insightsArticles.map((i) => ({
    path: `/insights/${i.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: i.datePublished || currentDate,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: p.publishedAt || currentDate,
  }));

  const allEntries = [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...insightRoutes,
    ...blogRoutes,
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (e) => `  <url>
    <loc>${siteConfig.url}${e.path}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return body;
}
