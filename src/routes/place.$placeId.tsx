import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Heart, Share2, ArrowRight, Headphones, Clock, AudioLines, Mic } from "lucide-react";
import { getPlace, places } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/place/$placeId")({
  loader: ({ params }) => {
    const place = getPlace(params.placeId);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "الموقع غير متاح — سمر" }, { name: "robots", content: "noindex" }] };
    }
    const { place } = loaderData;
    return {
      meta: [
        { title: `${place.name} — سمر` },
        { name: "description", content: place.tagline },
        { property: "og:title", content: `${place.name} — سمر` },
        { property: "og:description", content: place.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: PlaceNotFound,
  component: PlaceDetails,
});

function PlaceNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-xl font-bold text-foreground">لم نجد هذا الموقع</h1>
      <Link to="/explore" className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
        العودة للاستكشاف
      </Link>
    </div>
  );
}

function PlaceDetails() {
  const { place } = Route.useLoaderData();
  const { isFavorite, toggleFavorite } = useAppState();
  const router = useRouter();
  const fav = isFavorite(place.id);
  const related = places.filter((p) => p.id !== place.id).slice(0, 4);

  return (
    <div className="surface-warm flex min-h-screen justify-center">
      <div className="w-full max-w-2xl bg-background pb-12">
        <div className="relative">
          <img
            src={place.image}
            alt={place.name}
            width={800}
            height={600}
            className="h-64 sm:h-80 md:h-96 w-full object-cover"
          />
          <div className="veil absolute inset-0" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  window.history.back();
                } else {
                  router.navigate({ to: "/explore" });
                }
              }}
              aria-label="رجوع"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-card/85 text-foreground backdrop-blur cursor-pointer hover:bg-card transition-colors"
            >
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="مشاركة"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-card/85 text-foreground backdrop-blur"
              >
                <Share2 className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(place.id)}
                aria-label="المفضلة"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur",
                  fav ? "bg-primary text-primary-foreground" : "bg-card/85 text-foreground",
                )}
              >
                <Heart className={cn("h-4.5 w-4.5", fav && "fill-current")} />
              </button>
            </div>
          </div>
          <div className="absolute bottom-5 start-5 text-start">
            <h1 className="text-3xl font-bold text-[oklch(0.98_0.01_84)]">{place.name}</h1>
            <p className="mt-1 text-sm text-[oklch(0.9_0.02_84)]">{place.tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse border-b border-border px-5 py-5 text-center">
          <Stat icon={<AudioLines className="h-4.5 w-4.5" />} label="جولة صوتية" value="متاحة" />
          <Stat icon={<Clock className="h-4.5 w-4.5" />} label="مدة الجولة" value={`${place.minutes} دقيقة`} />
          <Stat icon={<Headphones className="h-4.5 w-4.5" />} label="القصص" value={`${place.stories} قصة`} />
        </div>

        <div className="page-enter space-y-6 px-5 pt-6">
          <section>
            <h2 className="mb-2 text-base font-bold text-foreground">عن المكان</h2>
            <p className="text-sm leading-7 text-muted-foreground">{place.description}</p>
          </section>

          <Link
            to="/voice"
            className="surface-card flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 shadow-elevated transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="surface-brand flex h-20 w-20 items-center justify-center rounded-full text-primary-foreground shadow-glow">
              <Mic className="h-8 w-8" />
            </span>
            <span className="text-sm font-bold text-foreground">اسأل راوي المكان</span>
            <span className="text-xs text-muted-foreground">اكتشف التاريخ كما لم تسمعه من قبل</span>
          </Link>

          <Link
            to="/player/$placeId"
            params={{ placeId: place.id }}
            className="surface-brand block w-full max-w-sm mx-auto rounded-full py-4 text-center text-sm font-bold text-primary-foreground shadow-glow transition-transform duration-300 active:scale-[0.98]"
          >
            ابدأ الجولة
          </Link>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">مواقع قريبة</h2>
            <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to="/place/$placeId"
                  params={{ placeId: p.id }}
                  className="w-32 shrink-0"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-20 w-full rounded-2xl object-cover shadow-card"
                  />
                  <p className="mt-2 truncate text-xs font-semibold text-foreground">{p.name}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-bold text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
