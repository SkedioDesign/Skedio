import { siteConfig } from "./site-config";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/skedio-logomark.png`,
    image: `${siteConfig.url}/skedio-primary.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: [siteConfig.socials.linkedin, siteConfig.socials.instagram, siteConfig.socials.behance],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: siteConfig.email,
        telephone: siteConfig.phone,
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.address.addressCountry,
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: "en-US",
  };
}

export interface ServiceSchemaInput {
  name?: string;
  title?: string;
  description?: string;
  definition?: string;
  url?: string;
  slug?: string;
  serviceType?: string;
  shortTitle?: string;
  deliverables?: string[];
}

export function getServiceSchema(service: ServiceSchemaInput) {
  const serviceName = service.name || service.title || "Design Service";
  const serviceDescription = service.description || service.definition || "";
  const serviceType = service.serviceType || service.shortTitle || serviceName;
  const servicePath = service.url || (service.slug ? `/services/${service.slug}` : "");
  const fullUrl = servicePath
    ? servicePath.startsWith("http")
      ? servicePath
      : `${siteConfig.url}${servicePath.startsWith("/") ? "" : "/"}${servicePath}`
    : siteConfig.url;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    serviceType,
    description: serviceDescription,
    url: fullUrl,
    provider: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    ...(service.deliverables && service.deliverables.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${serviceName} Deliverables`,
            itemListElement: service.deliverables.map((d, idx) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: d,
              },
              position: idx + 1,
            })),
          },
        }
      : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, idx) => {
      const itemUrl = crumb.item || "/";
      const fullUrl = itemUrl.startsWith("http")
        ? itemUrl
        : `${siteConfig.url}${itemUrl.startsWith("/") ? "" : "/"}${itemUrl}`;

      return {
        "@type": "ListItem",
        position: idx + 1,
        name: crumb.name,
        item: fullUrl,
      };
    }),
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export interface ItemListEntry {
  name: string;
  url: string;
}

function absoluteUrl(path: string): string {
  return path.startsWith("http")
    ? path
    : `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function getItemListSchema(name: string, entries: ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: entry.name,
      url: absoluteUrl(entry.url),
    })),
  };
}

export function getContactPageSchema(path = "/contact") {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl(path)}#contactpage`,
    url: absoluteUrl(path),
    name: `Contact ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name} about brand identity, product design, or digital product development.`,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: { "@id": `${siteConfig.url}/#organization` },
  };
}

export interface CreativeWorkInput {
  name: string;
  headline: string;
  description: string;
  image?: string;
  url: string;
  /**
   * ISO-8601 date (YYYY-MM-DD) the work was first published.
   * Required, not optional: the Project content model already mandates
   * `publishedDate`, so making it optional here would only invite a
   * placeholder. An absent date is emitted as an absent property below
   * rather than a fabricated one.
   */
  datePublished: string;
  client?: string;
}

export function getCreativeWorkSchema(work: CreativeWorkInput) {
  const workUrl = work.url || "";
  const fullUrl = workUrl.startsWith("http")
    ? workUrl
    : `${siteConfig.url}${workUrl.startsWith("/") ? "" : "/"}${workUrl}`;
  const fullImage = work.image
    ? work.image.startsWith("http")
      ? work.image
      : `${siteConfig.url}${work.image.startsWith("/") ? "" : "/"}${work.image}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.name,
    headline: work.headline,
    description: work.description,
    url: fullUrl,
    image: fullImage,
    // Omitted when empty rather than defaulted to a placeholder. A wrong
    // date is worse than no date: it asserts a publication time the work
    // never had, and this schema type has no dateModified to correct it.
    ...(work.datePublished ? { datePublished: work.datePublished } : {}),
    author: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
    creator: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
    provider: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
  };
}

export interface ArticleInput {
  title: string;
  description: string;
  /**
   * Root-relative path of the page this article is rendered on, e.g.
   * "/blog/my-post" or "/insights/my-article". Passed explicitly rather than
   * derived from a slug, because blog and insights posts share the same
   * builder and a hardcoded section produced self-contradicting URLs:
   * /blog/<slug> pages emitted url + mainEntityOfPage pointing at
   * /insights/<slug>, which 404s and disagrees with their own canonical.
   * Must match the canonical link and breadcrumb trail for the page.
   */
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}

export function getArticleSchema(article: ArticleInput) {
  const url = absoluteUrl(article.path);
  const fullImage = article.image
    ? article.image.startsWith("http")
      ? article.image
      : `${siteConfig.url}${article.image.startsWith("/") ? "" : "/"}${article.image}`
    : `${siteConfig.url}/og-default.png`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image: fullImage,
    author: {
      "@type": "Person",
      name: article.authorName || "Skédio Team",
      worksFor: {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
      },
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/skedio-logomark.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
