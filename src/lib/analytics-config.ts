// Client-side (browser) Umami configuration, read from build-time VITE_* env vars.
// These are inlined at build time and are safe to expose to the browser.

export const umamiScriptSrc =
  (import.meta.env["VITE_UMAMI_SCRIPT_SRC"] as string | undefined) ??
  "https://cloud.umami.is/script.js";

export const umamiWebsiteId =
  (import.meta.env["VITE_UMAMI_WEBSITE_ID"] as string | undefined) ?? "";

// Only required for self-hosted Umami instances served from a different origin.
export const umamiHostUrl = (import.meta.env["VITE_UMAMI_HOST_URL"] as string | undefined) ?? "";
