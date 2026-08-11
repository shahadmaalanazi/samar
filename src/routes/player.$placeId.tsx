import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react";
import { getPlace } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { PageHeader } from "@/components/chrome";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/player/$placeId")({
  loader: ({ params }) => {
    const place = getPlace(params.placeId);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "الجولة غير متاحة — سمر" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `جولة صوتية في ${loaderData.place.name} — سمر` },
        { name: "description", content: `استمع للجولة الصوتية في ${loaderData.place.name}: ${loaderData.place.tagline}` },
        { property: "og:title", content: `جولة صوتية في ${loaderData.place.name} — سمر` },
        { property: "og:description", content: loaderData.place.tagline },
        { property: "og:type", content: "music.song" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Link to="/explore" className="text-sm text-primary">
        العودة للاستكشاف
      </Link>
    </div>
  ),
  component: PlayerPage,
});

function PlayerPage() {
  const { place } = Route.useLoaderData();
  const { isFavorite, toggleFavorite } = useAppState();
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(18);
  const total = place.minutes * 60;

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (playing) {
      window.speechSynthesis.cancel();
      const text = `${place.name}. ${place.tagline}. ${place.description || "أهلاً بك في الجولة الصوتية الاستكشافية لهذا المعلم التراثي العريق."}`;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } else {
      window.speechSynthesis.pause();
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [playing, place]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.5)), 300);
    return () => clearInterval(id);
  }, [playing]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen justify-center bg-ink">
      <div className="relative w-full max-w-2xl overflow-hidden shadow-2xl">
        <img
          src={place.image}
          alt={place.name}
          width={800}
          height={600}
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-45"
        />
        <div className="veil absolute inset-0" />
        <div className="relative flex min-h-screen flex-col text-[oklch(0.96_0.01_84)]">
          <PageHeader title={place.name} subtitle="جولة صوتية" actions={<span />} />

          <div className="page-enter mt-auto space-y-6 px-8 pb-14 max-w-2xl mx-auto w-full text-center">
            {/* Dynamic Animated Waveform */}
            <div className="flex h-24 items-end justify-center gap-1">
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-1.5 rounded-full transition-all duration-200",
                    i / 48 < progress / 100 ? "bg-[oklch(0.86_0.09_70)]" : "bg-[oklch(0.8_0.02_80)]/35",
                  )}
                  style={{ height: playing ? `${20 + Math.abs(Math.sin((i + progress) * 0.4)) * 80}%` : "30%" }}
                />
              ))}
            </div>

            <div>
              <h1 className="text-3xl font-black">{place.tagline}</h1>
              <p className="mt-2 text-sm opacity-75">{place.region}</p>
            </div>

            {/* Audio Progress Bar */}
            <div className="w-full">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = ((e.clientX - rect.left) / rect.width) * 100;
                  setProgress(Math.max(0, Math.min(100, pct)));
                }}
                className="h-2 w-full overflow-hidden rounded-full bg-[oklch(0.9_0.01_84)]/25 cursor-pointer"
              >
                <div
                  className="h-full rounded-full bg-[oklch(0.86_0.09_70)] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs opacity-75 font-mono">
                <span>{fmt((progress / 100) * total)}</span>
                <span>{fmt(total)}</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-8 pt-2">
              <button
                type="button"
                aria-label="السابق"
                onClick={() => setProgress(0)}
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <SkipBack className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "إيقاف مؤقت" : "تشغيل"}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[oklch(0.96_0.01_84)] text-[oklch(0.3_0.05_52)] shadow-glow transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ms-1" />}
              </button>
              <button
                type="button"
                aria-label="التالي"
                onClick={() => setProgress(100)}
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <SkipForward className="h-7 w-7" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(place.id)}
              className="mx-auto flex items-center gap-2 rounded-full border border-[oklch(0.9_0.01_84)]/30 px-6 py-2.5 text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Heart className={cn("h-4 w-4", isFavorite(place.id) && "fill-current text-primary")} />
              {isFavorite(place.id) ? "في المفضلة ❤️" : "أضف للمفضلة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
