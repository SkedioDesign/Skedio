import { siteConfig } from "./site-config";

export interface SeoProps {
  title: string;
  description: string;
  image?: string;
  /**
   * Intrinsic pixel size of `image`, emitted as og:image:width/height.
   * Defaults to the measured size of siteConfig.ogImage — pass both whenever a
   * page uses a card of its own, and pass them as a PAIR: a crawler that gets a
   * width without the matching height lays the card out at the wrong aspect
   * ratio, which is worse than not declaring either.
   */
  imageWidth?: number;
  imageHeight?: number;
  /**
   * Alt text for the social card image. Defaults to the page title so a card is
   * never published without a text alternative — a11y, and it is also what some
   * chat surfaces read out.
   */
  imageAlt?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  /** ISO date; emits article:published_time. Only meaningful for type "article". */
  publishedTime?: string;
  themeColor?: string;
  noindex?: boolean;
}

/** SERP display limits. Copy outside these is truncated or rewritten by Google. */
export const TITLE_LENGTH = { min: 30, max: 60 };
export const DESCRIPTION_LENGTH = { min: 70, max: 160 };

/**
 * og:image:type, derived from the file extension so a card can never claim to
 * be a format it is not (the JPEGs under /HaoCabs, /EDIOS and /tiffinly are
 * used as cards on /projects and /insights).
 *
 * Anything outside this map OMITS the property rather than guessing. An absent
 * type is ignored by crawlers; a wrong one is not, and one that contradicts the
 * bytes actually served is how a card ends up rendering as a broken image on
 * the one surface that chose to believe it.
 */
const OG_IMAGE_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

function ogImageType(imageUrl: string): string | undefined {
  const path = imageUrl.split(/[?#]/)[0] ?? "";
  const ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  // No dot at all (e.g. an /api/og?title=… endpoint): lastIndexOf is -1, so
  // `ext` would be the whole path. Comparing against the path detects that.
  return ext === path ? undefined : OG_IMAGE_TYPES[ext];
}

const warned = new Set<unknown>();

/**
 * Flags copy that will be truncated in search results.
 *
 * Advisory only — it never blocks a build or a render, because the wording is
 * an owner decision. This exists so that drift is *noticed* during development
 * rather than discovered in a Search Console report months later. Warns once
 * per distinct problem so a re-render does not flood the server log.
 */
export function checkCopyLength(title: string, description: string): void {
  if (!import.meta.env.DEV) return;
  const issues: string[] = [];
  if (title.length < TITLE_LENGTH.min || title.length > TITLE_LENGTH.max) {
    issues.push(`title is ${title.length} chars (aim ${TITLE_LENGTH.min}-${TITLE_LENGTH.max})`);
  }
  if (description.length < DESCRIPTION_LENGTH.min || description.length > DESCRIPTION_LENGTH.max) {
    issues.push(
      `description is ${description.length} chars (aim ${DESCRIPTION_LENGTH.min}-${DESCRIPTION_LENGTH.max})`,
    );
  }
  for (const issue of issues) {
    if (warned.has(issue)) continue;
    warned.add(issue);
    console.warn(`[seo] "${title}" — ${issue}`);
  }
}

/**
 * THE single builder for absolute site URLs. Canonical <link>, og:url,
 * JSON-LD `url`/`@id` values, sitemap <loc> and every breadcrumb/item URL all
 * route through this so they cannot drift apart.
 *
 * The one canonical format is:
 *
 *   root      -> https://www.skediodesign.in/     (trailing slash)
 *   non-root  -> https://www.skediodesign.in/about  (no trailing slash)
 *
 * That asymmetry is deliberate and is enforced end-to-end: a 308 PERMANENT
 * redirect in src/server.ts (trailingSlashRedirect) normalizes "/about/" to
 * "/about" and deliberately leaves "/" alone, because stripping the root's
 * slash would produce an empty path. Sitemap <loc> values in
 * lib/sitemap-generator.ts mirror the same rule, and every page's
 * rel="canonical" must be byte-identical to its sitemap entry.
 *
 * Defaults to "/" rather than the bare origin because siteConfig.url has no
 * trailing slash (it is a concatenation prefix, see site-config.ts). Defaulting
 * to it would emit "https://www.skediodesign.in" as a page URL — a second,
 * forbidden spelling of the root that contradicts the canonical above.
 */
export function toAbsoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (path === "" || path === "/") return `${siteConfig.url}/`;
  // `path` is normalised to a leading slash first so a caller passing "about"
  // cannot produce "https://www.skediodesign.inabout".
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Builds the full metadata set for a page. Every route's `head()` goes through
 * here — this is the only place that emits title/description/robots/OG/Twitter,
 * which is what keeps the nine required fields from drifting between routes.
 */
export function seo({
  title,
  description,
  image = siteConfig.ogImage,
  imageWidth = siteConfig.ogImageWidth,
  imageHeight = siteConfig.ogImageHeight,
  imageAlt,
  url = "/",
  type = "website",
  publishedTime,
  themeColor = siteConfig.themeColor,
  noindex = false,
}: SeoProps) {
  checkCopyLength(title, description);

  const fullUrl = toAbsoluteUrl(url);
  const fullImage = toAbsoluteUrl(image);
  const alt = imageAlt ?? title;
  const imageType = ogImageType(fullImage);

  const metaList: Array<
    { title: string } | { name: string; content: string } | { property: string; content: string }
  > = [
    { title },
    { name: "description", content: description },

    // Emitted for every page, not only the noindexed ones. An unstated robots
    // directive means "index, follow" by default, which leaves the indexability
    // decision implicit and therefore unauditable — every route's intent should
    // be written down where it can be asserted in a test.
    { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },

    { name: "theme-color", content: themeColor },

    // Open Graph
    { property: "og:site_name", content: siteConfig.name },
    { property: "og:locale", content: siteConfig.locale },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: fullImage },
    // Declared AFTER og:image (which states WHICH file) and before og:image:alt
    // (the text alternative), so a crawler reading in order sees the bytes'
    // identity and geometry before its description.
    { property: "og:image:width", content: String(imageWidth) },
    { property: "og:image:height", content: String(imageHeight) },
    ...(imageType ? [{ property: "og:image:type", content: imageType }] : []),
    { property: "og:image:alt", content: alt },
    { property: "og:url", content: fullUrl },

    // Twitter / X card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: fullImage },
    { name: "twitter:image:alt", content: alt },
  ];

  // article:* is only meaningful for article-type pages, and publishing a card
  // with a type of "article" but no date is an incomplete declaration.
  if (type === "article" && publishedTime) {
    metaList.push({ property: "article:published_time", content: publishedTime });
  }

  return metaList;
}

export function canonicalLink(path: string = "/") {
  return [{ rel: "canonical", href: toAbsoluteUrl(path) }];
}
