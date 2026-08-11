import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Map as MapIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { PlaceCard } from "@/components/place-card";
import { categories, places } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "اكتشف المواقع التراثية — سمر" },
      { name: "description", content: "تصفح المواقع التراثية السعودية حسب الفئة وابحث عن وجهتك القادمة." },
      { property: "og:title", content: "اكتشف المواقع التراثية — سمر" },
      { property: "og:description", content: "قلاع وبلدات قديمة وواحات ومواقع صخرية في مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const results = useMemo(
    () =>
      places.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (q.trim() === "" ||
            p.name.includes(q) ||
            p.nameEn.toLowerCase().includes(q.toLowerCase()) ||
            p.region.includes(q)),
      ),
    [q, cat],
  );

  return (
    <AppShell>
      <PageHeader
        title="اكتشف"
        subtitle={`${results.length} موقع تراثي`}
        actions={
          <Link
            to="/map"
            aria-label="الخريطة"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            <MapIcon className="h-4.5 w-4.5" />
          </Link>
        }
      />

      <div className="px-5">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3 shadow-card">
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن مكان…"
            className="w-full bg-transparent text-sm text-foreground outline-hidden placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              cat === c.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 px-5 pt-5">
        {results.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
        {results.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة.</p>
        ) : null}
      </div>
    </AppShell>
  );
}
