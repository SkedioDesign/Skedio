import { type ImgHTMLAttributes } from "react";

type WebpImageProps = ImgHTMLAttributes<HTMLImageElement>;

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
 */
export function WebpImage({ src, alt = "", ...props }: WebpImageProps) {
  const webpSrc =
    src && RASTER_WEBP_SRC.test(src) ? encodeURI(src.replace(RASTER_WEBP_SRC, ".webp")) : null;

  if (!webpSrc) return <img src={src} alt={alt} {...props} />;

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...props} />
    </picture>
  );
}
