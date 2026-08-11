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
  blindMode: boolean;
  toggleBlindMode: () => void;

  // Dynamic User Profile & Progression
  userName: string;
  setUserName: (name: string) => void;
  userPoints: number;
  userTrips: number;
  userStories: number;
  completedChallenges: string[];
  toggleChallenge: (id: string, points: number) => void;
  earnedBadges: string[];
  toggleBadge: (id: string) => void;
  incrementStories: () => void;
  incrementTrips: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [lang, setLang] = useState<Lang>("ar");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [blindMode, setBlindMode] = useState<boolean>(false);

  // New user defaults (0 everything)
  const [userName, setUserNameState] = useState<string>("مستكشف جديد");
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userTrips, setUserTrips] = useState<number>(0);
  const [userStories, setUserStories] = useState<number>(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("samar-theme") as Theme | null;
    if (storedTheme) setTheme(storedTheme);

    const storedLang = window.localStorage.getItem("samar-lang") as Lang | null;
    if (storedLang) setLang(storedLang);

    const storedFav = window.localStorage.getItem("samar-favorites");
    if (storedFav) setFavorites(JSON.parse(storedFav) as string[]);

    const storedBlind = window.localStorage.getItem("samar-blind-mode");
    if (storedBlind) setBlindMode(storedBlind === "true");

    const storedName = window.localStorage.getItem("samar-user-name");
    if (storedName) setUserNameState(storedName);

    const storedPoints = window.localStorage.getItem("samar-user-points");
    if (storedPoints) setUserPoints(Number(storedPoints));

    const storedTrips = window.localStorage.getItem("samar-user-trips");
    if (storedTrips) setUserTrips(Number(storedTrips));

    const storedStories = window.localStorage.getItem("samar-user-stories");
    if (storedStories) setUserStories(Number(storedStories));

    const storedChallenges = window.localStorage.getItem("samar-completed-challenges");
    if (storedChallenges) setCompletedChallenges(JSON.parse(storedChallenges) as string[]);

    const storedBadges = window.localStorage.getItem("samar-earned-badges");
    if (storedBadges) setEarnedBadges(JSON.parse(storedBadges) as string[]);
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

  useEffect(() => {
    document.documentElement.classList.toggle("blind-mode-active", blindMode);
    window.localStorage.setItem("samar-blind-mode", String(blindMode));
  }, [blindMode]);

  useEffect(() => {
    window.localStorage.setItem("samar-user-name", userName);
  }, [userName]);

  useEffect(() => {
    window.localStorage.setItem("samar-user-points", String(userPoints));
  }, [userPoints]);

  useEffect(() => {
    window.localStorage.setItem("samar-user-trips", String(userTrips));
  }, [userTrips]);

  useEffect(() => {
    window.localStorage.setItem("samar-user-stories", String(userStories));
  }, [userStories]);

  useEffect(() => {
    window.localStorage.setItem("samar-completed-challenges", JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  useEffect(() => {
    window.localStorage.setItem("samar-earned-badges", JSON.stringify(earnedBadges));
  }, [earnedBadges]);

  const setUserName = (name: string) => {
    const trimmed = name.trim() || "مستكشف جديد";
    setUserNameState(trimmed);
  };

  const toggleChallenge = (id: string, points: number) => {
    if (completedChallenges.includes(id)) {
      setCompletedChallenges((prev) => prev.filter((x) => x !== id));
      setUserPoints((p) => Math.max(0, p - points));
    } else {
      setCompletedChallenges((prev) => [...prev, id]);
      setUserPoints((p) => p + points);
    }
  };

  const toggleBadge = (id: string) => {
    if (earnedBadges.includes(id)) {
      setEarnedBadges((prev) => prev.filter((x) => x !== id));
      setUserPoints((p) => Math.max(0, p - 50));
    } else {
      setEarnedBadges((prev) => [...prev, id]);
      setUserPoints((p) => p + 50);
    }
  };

  const incrementStories = () => {
    setUserStories((s) => s + 1);
    setUserPoints((p) => p + 25);
  };

  const incrementTrips = () => {
    setUserTrips((t) => t + 1);
    setUserPoints((p) => p + 100);
  };

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
      blindMode,
      toggleBlindMode: () => setBlindMode((b) => !b),
      userName,
      setUserName,
      userPoints,
      userTrips,
      userStories,
      completedChallenges,
      toggleChallenge,
      earnedBadges,
      toggleBadge,
      incrementStories,
      incrementTrips,
    }),
    [theme, lang, favorites, blindMode, userName, userPoints, userTrips, userStories, completedChallenges, earnedBadges],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
