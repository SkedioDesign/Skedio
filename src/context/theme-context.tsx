import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext } from "@/context/use-theme";
import { applyTheme, getInitialTheme, persistTheme } from "@/lib/theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
