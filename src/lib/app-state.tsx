import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Lang = "ar" | "en";
type Theme = "light" | "dark";

type AppState = {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  toggleLang: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [lang, setLang] = useState<Lang>("ar");
  const [favorites, setFavorites] = useState<string[]>(["alula", "diriyah"]);

  useEffect(() => {
    const stored = window.localStorage.getItem("samar-theme") as Theme | null;
    if (stored) setTheme(stored);
    const storedLang = window.localStorage.getItem("samar-lang") as Lang | null;
    if (storedLang) setLang(storedLang);
    const storedFav = window.localStorage.getItem("samar-favorites");
    if (storedFav) setFavorites(JSON.parse(storedFav) as string[]);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("samar-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("samar-lang", lang);
  }, [lang]);

  useEffect(() => {
    window.localStorage.setItem("samar-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo<AppState>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      lang,
      toggleLang: () => setLang((l) => (l === "ar" ? "en" : "ar")),
      favorites,
      toggleFavorite: (id) =>
        setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
      isFavorite: (id) => favorites.includes(id),
    }),
    [theme, lang, favorites],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
