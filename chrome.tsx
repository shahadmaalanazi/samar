import { Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, Moon, Sun, Heart, Share2 } from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useAppState();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary",
        className,
      )}
    >
      {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
    </button>
  );
}

export function LangToggle() {
  const { lang, toggleLang } = useAppState();
  return (
    <button
      type="button"
      onClick={toggleLang}
      className="flex h-10 items-center justify-center rounded-full border border-border bg-card px-3 text-xs font-bold text-foreground transition-colors hover:bg-secondary"
    >
      {lang === "ar" ? "EN" : "ع"}
    </button>
  );
}

export function PageHeader({
  title,
  subtitle,
  back = true,
  actions,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  actions?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 pb-4 pt-6">
      {back ? (
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="رجوع"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowRight className="h-4.5 w-4.5 rtl:rotate-0 ltr:rotate-180" />
        </button>
      ) : (
        <span />
      )}
      <div className="min-w-0 text-center">
        <h1 className="truncate text-lg font-bold text-foreground">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">{actions ?? <ThemeToggle />}</div>
    </header>
  );
}

export function IconPill({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}

export { Heart, Share2, Link };
