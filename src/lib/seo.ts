import { siteConfig } from "./site-config";

export interface SeoProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  themeColor?: string;
  noindex?: boolean;
}

export function seo({
  title,
  description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = "website",
  themeColor = siteConfig.themeColor,
  noindex = false,
}: SeoProps) {
  const fullUrl = url.startsWith("http")
    ? url
    : `${siteConfig.url}${url.startsWith("/") ? "" : "/"}${url}`;
  const fullImage = image.startsWith("http")
    ? image
    : `${siteConfig.url}${image.startsWith("/") ? "" : "/"}${image}`;

  const metaList: Array<
    { title: string } | { name: string; content: string } | { property: string; content: string }
  > = [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: themeColor },

    // Open Graph
    { property: "og:site_name", content: siteConfig.name },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: fullImage },
    { property: "og:url", content: fullUrl },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: fullImage },
  ];

  if (noindex) {
    metaList.push({ name: "robots", content: "noindex, nofollow" });
  }

  return metaList;
}

export function canonicalLink(path: string = "") {
  const fullUrl = path.startsWith("http")
    ? path
    : `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`;
  return [{ rel: "canonical", href: fullUrl }];
}
