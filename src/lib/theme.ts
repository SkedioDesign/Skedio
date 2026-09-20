// Light/dark theme helpers. The theme is a single `.dark` class on <html>
// (styles.css defines the token map for `.dark`). User choice is persisted in
// localStorage; first-time visitors inherit their OS preference.

export type Theme = "light" | "dark";

const STORAGE_KEY = "skedio-theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#121212" : "#8537F4");
  }
}

export function persistTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures (e.g. private mode).
  }
}

// Used by the FOUC-prevention snippet in __root.tsx. Keep it in sync with the
// helpers above (it must run before hydration).
export const FOUC_SCRIPT = `(function(){try{var k="skedio-theme",t;try{t=localStorage.getItem(k)}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;if(t==="dark"){r.classList.add("dark")}r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute("content",t==="dark"?"#121212":"#8537F4")}}catch(e){}})();`;
