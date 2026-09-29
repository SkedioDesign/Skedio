export const siteConfig = {
  name: "Skédio",
  legalName: "Skédio Creative Studio",
  /**
   * Canonical origin. MUST be the "www" host: https://skediodesign.in 308-redirects
   * to https://www.skediodesign.in/, so pointing this at the bare apex would make
   * every canonical, og:url, sitemap entry and JSON-LD URL a redirect.
   *
   * No MX record exists for this domain, so siteConfig.email is deliberately a
   * Gmail address rather than hello@skediodesign.in.
   */
  url: "https://www.skediodesign.in",
  ogImage: "/og-default.png",
  description:
    "Skédio is a creative studio crafting bold brands, beautiful experiences and digital products that help businesses grow.",
  email: "skediodesignspace@gmail.com",
  phone: "+91 97709 57780",
  /**
   * The studio's single published response-time promise.
   *
   * Referenced by the homepage hero, /contact (4x), ContactModal, the FAQ
   * answer, the /contact meta description and llms.txt. It was previously
   * written out by hand in each of those places and had drifted into three
   * conflicting numbers — "36 hours" on the homepage hero, "24 hours" on
   * /contact, and "one to two business days" in the FAQ — so the copy now
   * interpolates this instead.
   *
   * Update the promise here and every surface follows.
   */
  responseTime: "24 hours",
  socials: {
    linkedin: "https://www.linkedin.com/company/skedio",
    instagram: "https://www.instagram.com/skedio.studio",
    behance: "https://www.behance.net/skedio",
  },
  themeColor: "#8537F4",
  address: {
    addressCountry: "IN",
  },
};

export type SiteConfig = typeof siteConfig;
