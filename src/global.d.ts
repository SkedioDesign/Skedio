/**
 * Set by PAGE_LOADER_BOOT_SCRIPT (lib/page-loader.ts) the moment it decides to
 * show the intro overlay.
 *
 * It lives on `window` rather than on <html> because React recreates <html> on
 * its post-hydration commit and wipes every attribute there — including the
 * armed class that CSS keys off. See pageLoaderArmed().
 */
declare global {
  interface Window {
    __skPreloaderArmed?: 1;
  }
}

export {};
