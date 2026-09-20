const CONSENT_KEY = "skedio-analytics-consent";
export const COOKIE_SETTINGS_EVENT = "skedio:open-cookie-settings";

import { umamiScriptSrc, umamiWebsiteId, umamiHostUrl } from "./analytics-config";

export type ConsentChoice = "accepted" | "declined";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Ignore storage failures (e.g. private mode); banner will simply stay available.
  }
}

let analyticsInitialized = false;
let analyticsScript: HTMLScriptElement | null = null;

export function initAnalytics(): void {
  if (typeof window === "undefined" || analyticsInitialized) return;
  analyticsInitialized = true;

  if (!umamiWebsiteId) {
    console.warn(
      "[analytics] Umami website ID is not configured (VITE_UMAMI_WEBSITE_ID); skipping script injection.",
    );
    window.dispatchEvent(new Event("skedio:analytics-enabled"));
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src = umamiScriptSrc;
  script.setAttribute("data-website-id", umamiWebsiteId);
  if (umamiHostUrl) script.setAttribute("data-host-url", umamiHostUrl);
  script.referrerPolicy = "no-referrer-when-downgrade";
  analyticsScript = script;
  document.head.appendChild(script);

  window.dispatchEvent(new Event("skedio:analytics-enabled"));
}

export function disableAnalytics(): void {
  if (typeof window === "undefined") return;
  analyticsInitialized = false;
  if (analyticsScript) {
    analyticsScript.remove();
    analyticsScript = null;
  }
  window.dispatchEvent(new Event("skedio:analytics-disabled"));
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
