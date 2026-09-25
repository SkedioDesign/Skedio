import { type ImgHTMLAttributes } from "react";

type WebpImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Responsive WebP candidates for the <source>, e.g.
   * "/ProductDesign-480.webp 480w, /ProductDesign-768.webp 768w".
   * URLs with spaces must already be percent-encoded (use encodeURI when
   * building them). When provided, `sizes` should also be set so the browser
   * can pick the right width. Falls back to the single .webp twin otherwise.
   */
  webpSrcSet?: string | undefined;
};

const RASTER_WEBP_SRC = /\.(jpe?g|png)$/i;

/**
 * WebP renderer. Wraps any <img> in a <picture> with a WebP <source>, so the
 * browser downloads the .webp twin (emitted at build time by
 * scripts/optimize-images.mjs, synthesized on demand by the dev middleware)
 * instead of the original format. The browser only uses the <source> when it
 * supports WebP; otherwise it falls back to the original <img> src.
 *
 * The twin URL is percent-encoded because srcset treats a raw space (or other
 * forbidden char) as a candidate descriptor separator — e.g. a filename such
 * as "Social Chums.png" would otherwise be split and dropped entirely.
 *
 * The <picture> wrapper is made layout-transparent (display: contents) so the
 * <img> sizes against its real parent exactly as it would without the wrapper.
 * Otherwise, `height: 100%` on the img can't resolve against the inline,
 * auto-height <picture>, and images sized by percentage height (e.g. h-full)
 * collapse to a width-proportional intrinsic size.
 *
 * Responsive usage: pass `webpSrcSet` (WebP candidates) alongside the img's
 * own `srcSet` (fallback-format candidates) and a shared `sizes`. The <source>
 * and <img> each get the same `sizes` so both pick an equivalent width:
 *
 *   <WebpImage
 *     src="/tiffinly/1-800.jpg"
 *     srcSet="/tiffinly/1-480.jpg 480w, /tiffinly/1-800.jpg 800w"
 *     webpSrcSet="/tiffinly/1-480.webp 480w, /tiffinly/1-800.webp 800w"
 *     sizes="(max-width: 768px) 100vw, 566px"
 *   />
 */
export function WebpImage({ src, alt = "", webpSrcSet, sizes, ...props }: WebpImageProps) {
  const webpSrc =
    src && RASTER_WEBP_SRC.test(src) ? encodeURI(src.replace(RASTER_WEBP_SRC, ".webp")) : null;

  // Explicit responsive candidates win; otherwise serve the single full-size
  // .webp twin (which `sizes` still applies to as a 1-candidate srcset).
  const sourceSrcSet = webpSrcSet ?? webpSrc;

  if (!sourceSrcSet) return <img src={src} alt={alt} sizes={sizes} {...props} />;

  return (
    <picture style={{ display: "contents" }}>
      <source srcSet={sourceSrcSet} sizes={sizes} type="image/webp" />
      <img src={src} alt={alt} sizes={sizes} {...props} />
    </picture>
  );
}
