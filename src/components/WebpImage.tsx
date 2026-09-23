import { type ImgHTMLAttributes } from "react";

type WebpImageProps = ImgHTMLAttributes<HTMLImageElement>;

const RASTER_WEBP_SRC = /\.(jpe?g|png)$/i;

/**
 * WebP renderer. Wraps any <img> in a <picture> with a WebP <source>, so the
 * browser automatically downloads the .webp twin (emitted at build time by
 * scripts/optimize-images.mjs) instead of the original format. Falls back to
 * the original src transparently when a .webp twin does not exist or the
 * browser does not support WebP.
 */
export function WebpImage({ src, alt = "", ...props }: WebpImageProps) {
  const webpSrc = src && RASTER_WEBP_SRC.test(src) ? src.replace(RASTER_WEBP_SRC, ".webp") : null;

  if (!webpSrc) return <img src={src} alt={alt} {...props} />;

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...props} />
    </picture>
  );
}
