const CONSENT_KEY = "skedio-analytics-consent";
export const COOKIE_SETTINGS_EVENT = "skedio:open-cookie-settings";

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

export function initAnalytics(): void {
  if (typeof window === "undefined" || analyticsInitialized) return;
  analyticsInitialized = true;
  // Placeholder: no analytics provider is configured yet. When one is added
  // (e.g. Plausible, Umami, GA4), inject/load its script here — this runs
  // only after the visitor has accepted analytics cookies.
  window.dispatchEvent(new Event("skedio:analytics-enabled"));
}

export function disableAnalytics(): void {
  if (typeof window === "undefined") return;
  analyticsInitialized = false;
  window.dispatchEvent(new Event("skedio:analytics-disabled"));
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
