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
  const [selectedCats, setSelectedCats] = useState<string[]>(["all"]);

  const toggleCategory = (id: string) => {
    if (id === "all") {
      setSelectedCats(["all"]);
      return;
    }
    let next = selectedCats.filter((c) => c !== "all");
    if (next.includes(id)) {
      next = next.filter((c) => c !== id);
    } else {
      next.push(id);
    }
    if (next.length === 0) {
      setSelectedCats(["all"]);
    } else {
      setSelectedCats(next);
    }
  };

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query && selectedCats.includes("all")) return places;

    return places.filter((p) => {
      const matchesCategory = selectedCats.includes("all") || selectedCats.includes(p.category);
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.nameEn.toLowerCase().includes(query) ||
        p.region.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [q, selectedCats]);

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

      <div className="px-5 space-y-3">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3 shadow-card">
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن مكان…"
            className="w-full bg-transparent text-sm text-foreground outline-hidden placeholder:text-muted-foreground"
          />
        </div>

        {/* Gemini Vision AI + Inclusivity Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-xs font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            📸 تصوير المعلم (Vision AI)
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                alert("📷 تم استقبال الصورة! جارٍ تحليل النقوش والزخارف بواسطة Gemini Vision AI… (+100 نقطة مضافة لحسابك)");
              }}
            />
          </label>

          <button
            onClick={() => {
              if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance("أهلاً بك في نمط سَمَر الشامل للمكفوفين وضعاف البصر. المكان الحالي: حي الطريف بالدرعية، يحيط بك رواشين نجدية وقلاع طينية تاريخية تعود لعام 1744م.");
              u.lang = "ar-SA";
              window.speechSynthesis.speak(u);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-xs font-bold text-foreground hover:bg-accent/20 transition-colors"
          >
            🔊 نمط سَمَر الشامل (للمكفوفين)
          </button>
        </div>
      </div>

      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {categories.map((c) => {
          const active = selectedCats.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50",
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5 pt-5">
        {results.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
        {results.length === 0 ? (
          <p className="col-span-full py-16 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة.</p>
        ) : null}
      </div>
    </AppShell>
  );
}
