import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { challenges } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "التحديات التفاعلية — سمر" },
      { name: "description", content: "اختبر معلوماتك عن التراث السعودي واجمع النقاط عبر تحديات تفاعلية." },
      { property: "og:title", content: "التحديات التفاعلية — سمر" },
      { property: "og:description", content: "تحديات ممتعة في كل موقع تراثي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengesPage,
});

const filters = [
  { id: "all", label: "الكل" },
  { id: "in-progress", label: "قيد التقدم" },
  { id: "done", label: "مكتملة" },
];

function ChallengesPage() {
  const [filter, setFilter] = useState("all");
  const list = challenges.filter((c) => filter === "all" || c.status === filter);

  return (
    <AppShell>
      <PageHeader title="التحديات" subtitle="اجمع النقاط واكشف القصص" />

      <div className="flex gap-2 px-5">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="space-y-3 px-5 pt-5">
        {list.map((c) => (
          <li
            key={c.id}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                c.status === "done" ? "bg-primary text-primary-foreground" : "bg-secondary text-primary",
              )}
            >
              {c.status === "done" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : c.status === "in-progress" ? (
                <Clock className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{c.title}</p>
              <p className="truncate text-xs text-muted-foreground">{c.place}</p>
            </div>
            <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-secondary-foreground">
              {c.points} نقطة
            </span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
