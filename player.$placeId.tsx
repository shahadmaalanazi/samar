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
    if (!playing) return;
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.25)), 300);
    return () => clearInterval(id);
  }, [playing]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen justify-center bg-ink">
      <div className="relative w-full max-w-lg overflow-hidden">
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

          <div className="page-enter mt-auto space-y-6 px-6 pb-14">
            <div className="flex h-24 items-end justify-center gap-1">
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-1 rounded-full transition-all duration-300",
                    i / 48 < progress / 100 ? "bg-[oklch(0.86_0.09_70)]" : "bg-[oklch(0.8_0.02_80)]/35",
                  )}
                  style={{ height: `${20 + Math.abs(Math.sin(i * 0.7)) * 70}%` }}
                />
              ))}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{place.tagline}</h1>
              <p className="mt-1 text-sm opacity-75">{place.region}</p>
            </div>

            <div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.9_0.01_84)]/25">
                <div
                  className="h-full rounded-full bg-[oklch(0.86_0.09_70)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] opacity-75">
                <span>{fmt((progress / 100) * total)}</span>
                <span>{fmt(total)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button type="button" aria-label="السابق" onClick={() => setProgress(0)}>
                <SkipBack className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "إيقاف مؤقت" : "تشغيل"}
                className="flex h-18 w-18 items-center justify-center rounded-full bg-[oklch(0.96_0.01_84)] text-[oklch(0.3_0.05_52)] shadow-glow transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
              </button>
              <button type="button" aria-label="التالي" onClick={() => setProgress(100)}>
                <SkipForward className="h-6 w-6" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(place.id)}
              className="mx-auto flex items-center gap-2 rounded-full border border-[oklch(0.9_0.01_84)]/30 px-5 py-2 text-xs"
            >
              <Heart className={cn("h-4 w-4", isFavorite(place.id) && "fill-current")} />
              {isFavorite(place.id) ? "في المفضلة" : "أضف للمفضلة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
