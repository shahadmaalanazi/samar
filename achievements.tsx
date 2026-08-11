import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { badges } from "@/lib/data";
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
  const earned = badges.filter((b) => b.earned).length;

  return (
    <AppShell>
      <PageHeader title="إنجازاتي" />

      <div className="mx-5 rounded-3xl border border-border bg-card p-6 text-center shadow-elevated surface-card">
        <p className="font-display text-6xl font-bold text-gold">{earned}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          شارة محققة من أصل {badges.length}
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="surface-brand h-full rounded-full transition-[width] duration-700"
            style={{ width: `${(earned / badges.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-5 pt-7">
        {badges.map((b, i) => (
          <div
            key={b.id}
            className="page-enter flex flex-col items-center gap-2 rounded-3xl border border-border bg-card p-3 text-center shadow-card"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span
              className={cn(
                "flex h-20 w-20 items-center justify-center border transition-transform duration-300 hover:scale-105",
                b.earned
                  ? "surface-brand border-accent text-primary-foreground shadow-glow"
                  : "border-border bg-muted text-muted-foreground opacity-60",
              )}
              style={{
                clipPath:
                  "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              }}
            >
              <Award className="h-8 w-8" />
            </span>
            <span className="text-xs font-bold text-foreground">{b.name}</span>
            <span className="text-[10px] text-muted-foreground">{b.place}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
