import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Mic, Heart, User, Hourglass } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const items: { to: string; label: string; icon: typeof Home; center?: boolean }[] = [
  { to: "/home", label: "الرئيسية", icon: Home },
  { to: "/explore", label: "اكتشف", icon: Compass },
  { to: "/voice", label: "راوي المكان", icon: Mic, center: true },
  { to: "/challenges", label: "إنجازاتي", icon: Hourglass },
  { to: "/profile", label: "ملفي", icon: User },
];


export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-card/85 shadow-elevated backdrop-blur-xl">
      <ul className="mx-auto flex max-w-lg items-end justify-between px-4 pb-3 pt-2">
        {items.map(({ to, label, icon: Icon, center }) => {
          const active = pathname.startsWith(to);
          if (center) {
            return (
              <li key={to} className="-mt-6">
                <Link
                  to={to}
                  className="surface-brand flex h-15 w-15 items-center justify-center rounded-full text-primary-foreground shadow-glow transition-transform duration-300 hover:scale-105 active:scale-95"
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex w-16 flex-col items-center gap-1 rounded-xl py-1 text-[11px] transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.4]")} />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AppShell({
  children,
  nav = true,
  className,
}: {
  children: ReactNode;
  nav?: boolean;
  className?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="surface-warm flex min-h-screen w-full justify-center">
      <div className="flex min-h-screen w-full max-w-7xl flex-col border-border bg-background sm:border-x shadow-2xl">
        <main key={pathname} className={cn("page-enter flex-1 pb-10 px-4 sm:px-8 pt-4", className)}>
          {children}
        </main>
        {nav ? <BottomNav /> : null}
      </div>
    </div>
  );
}

export function Favorites({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
