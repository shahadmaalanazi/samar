import { createFileRoute } from "@tanstack/react-router";
import { Award, Lock, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { badges } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { playSuccessSound, playClickSound } from "@/lib/sound-fx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "إنجازاتي وشاراتي — سمر" },
      { name: "description", content: "اجمع شارات المواقع التراثية السعودية وتابع تقدمك في رحلة الاكتشاف." },
      { property: "og:title", content: "إنجازاتي وشاراتي — سمر" },
      { property: "og:description", content: "شارات ومستويات تكشف تقدمك في التراث السعودي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const { earnedBadges, toggleBadge } = useAppState();
  const earnedCount = earnedBadges.length;

  const handleToggleBadge = (id: string) => {
    const isCurrentlyEarned = earnedBadges.includes(id);
    try {
      if (!isCurrentlyEarned) {
        playSuccessSound();
      } else {
        playClickSound();
      }
    } catch {}

    toggleBadge(id);
  };

  return (
    <AppShell>
      <PageHeader title="إنجازاتي" subtitle="اضغط على الشارة لفتح الإنجاز" />

      <div className="mx-5 max-w-xl w-full self-center rounded-3xl border border-border bg-card p-6 text-center shadow-elevated surface-card">
        <p className="font-display text-6xl font-bold text-gold">{earnedCount}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          شارة محققة من أصل {badges.length}
        </p>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="surface-brand h-full rounded-full transition-[width] duration-700"
            style={{ width: `${(earnedCount / badges.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-5 pt-7 pb-8">
        {badges.map((b, i) => {
          const isEarned = earnedBadges.includes(b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => handleToggleBadge(b.id)}
              className="page-enter flex flex-col items-center gap-2 rounded-3xl border border-border bg-card p-3 text-center shadow-card cursor-pointer hover:border-primary/50 transition-all active:scale-95"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span
                className={cn(
                  "relative flex h-20 w-20 items-center justify-center border transition-transform duration-300",
                  isEarned
                    ? "surface-brand border-accent text-primary-foreground shadow-glow scale-105"
                    : "border-border bg-muted text-muted-foreground opacity-60",
                )}
                style={{
                  clipPath:
                    "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                }}
              >
                {isEarned ? <Award className="h-9 w-9 text-gold" /> : <Lock className="h-7 w-7 opacity-50" />}
              </span>
              <span className="text-xs font-bold text-foreground">{b.name}</span>
              <span className="text-[10px] text-muted-foreground">{b.place}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-bold",
                  isEarned ? "bg-amber-500/20 text-amber-900 dark:text-amber-300" : "bg-muted text-muted-foreground"
                )}
              >
                {isEarned ? "تم الفتح ✓" : "مغلق"}
              </span>
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}
