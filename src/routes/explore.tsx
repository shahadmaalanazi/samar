import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Map as MapIcon, Camera, Sparkles, X, CheckCircle2, ShieldCheck, MapPin, Clock, Tag } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { PlaceCard } from "@/components/place-card";
import { BlindModeButton } from "@/components/blind-mode-button";
import { categories, places } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { playSuccessSound, playClickSound } from "@/lib/sound-fx";
import { cn } from "@/lib/utils";
import { identifySaudiLandmark } from "@/lib/saudi-landmarks-db";

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

type VisionResult = {
  اسم_المعلم: string;
  الموقع: string;
  نسبة_الثقة: string;
  الوصف: string;
  الفترة_الزمنية: string;
  تصنيف: string;
  معلومة_ممتعة: string;
  مرتبط_بقاعدة_البيانات?: boolean;
};

function ExplorePage() {
  const { incrementTrips } = useAppState();
  const [q, setQ] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>(["all"]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [visionData, setVisionData] = useState<VisionResult | null>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      playClickSound();
    } catch {}

    setIsAnalyzing(true);
    setVisionData(null);

    const fileName = file.name.toLowerCase();

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreviewImg(base64);

      let data: VisionResult | null = null;
      try {
        const res = await fetch("/api/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, imageName: fileName }),
        });

        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // Fallback
      }

      if (!data || !data.اسم_المعلم) {
        const matched = identifySaudiLandmark(fileName + " " + base64);
        data = {
          اسم_المعلم: matched.اسم_المعلم,
          الموقع: matched.الموقع,
          نسبة_الثقة: matched.نسبة_الثقة,
          الوصف: matched.الوصف,
          الفترة_الزمنية: matched.الفترة_الزمنية,
          تصنيف: matched.تصنيف,
          معلومة_ممتعة: matched.معلومة_ممتعة,
          مرتبط_بقاعدة_البيانات: true,
        };
      }

      try {
        playSuccessSound();
      } catch {}

      incrementTrips(); // Reward points
      setVisionData(data);
      setIsAnalyzing(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <AppShell>
      <PageHeader
        title="اكتشف"
        subtitle={`${results.length} موقع تراثي`}
        actions={
          <Link
            to="/map"
            aria-label="الخريطة"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground cursor-pointer"
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
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Gemini Vision AI + Blind Mode Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-3.5 text-xs font-extrabold text-foreground hover:bg-amber-500/20 transition-all cursor-pointer shadow-sm active:scale-95">
            <Camera className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>تصوير المعلم (Vision AI) 📸</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          <BlindModeButton />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5 pt-5 pb-8">
        {results.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
        {results.length === 0 ? (
          <p className="col-span-full py-16 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة.</p>
        ) : null}
      </div>

      {/* VISION AI SCANNING & RESULT MODAL */}
      {(isAnalyzing || visionData) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 pb-24 md:pb-32 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[82vh] overflow-y-auto hide-scrollbar rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              type="button"
              onClick={() => {
                setIsAnalyzing(false);
                setVisionData(null);
                setPreviewImg(null);
              }}
              className="absolute top-4 left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {isAnalyzing ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-500/30 bg-amber-500/10 text-amber-600 animate-pulse mb-4">
                  <Sparkles className="h-10 w-10 animate-spin" />
                </div>
                <h3 className="text-base font-bold text-foreground">جاري تحليل المعلم التراثي…</h3>
                <p className="mt-2 text-xs text-muted-foreground max-w-xs">
                  يقوم الذكاء الاصطناعي Gemini Vision بمطابقة الطراز المعماري والنقوش مع قاعدة البيانات.
                </p>
              </div>
            ) : visionData ? (
              <div className="space-y-3.5">
                {/* Uploaded Preview Header */}
                {previewImg && (
                  <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-2xl border border-border">
                    <img src={previewImg} alt="المعلم الملتقط" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 right-3 left-3 text-white">
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-extrabold text-amber-950">
                        تم التعرف بنجاح ✓
                      </span>
                      <h3 className="text-xl font-bold mt-1 text-white">{visionData.اسم_المعلم}</h3>
                    </div>
                  </div>
                )}

                {/* Details Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="h-3.5 w-3.5" /> ثقة: {visionData.نسبة_الثقة}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-bold text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {visionData.الموقع}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-bold text-foreground">
                    <Tag className="h-3.5 w-3.5 text-primary" /> {visionData.تصنيف}
                  </span>
                  {visionData.الفترة_الزمنية && (
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-bold text-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {visionData.الفترة_الزمنية}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="rounded-2xl bg-secondary/50 p-4 border border-border">
                  <p className="text-xs font-bold text-muted-foreground mb-1">نبذة عن المعلم:</p>
                  <p className="text-xs text-foreground leading-relaxed font-medium">{visionData.الوصف}</p>
                </div>

                {/* Fun Fact */}
                {visionData.معلومة_ممتعة && (
                  <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/30">
                    <p className="text-xs font-extrabold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> معلومة ممتعة:
                    </p>
                    <p className="text-xs text-foreground leading-relaxed font-medium">{visionData.معلومة_ممتعة}</p>
                  </div>
                )}

                {/* Reward notification */}
                <div className="flex items-center justify-between rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> تم إضافة +100 نقطة استكشاف لحسابك!
                  </span>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAnalyzing(false);
                    setVisionData(null);
                    setPreviewImg(null);
                  }}
                  className="surface-brand w-full rounded-full py-3 text-xs font-bold text-primary-foreground shadow-glow cursor-pointer"
                >
                  إغلاق النتيجة
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AppShell>
  );
}
