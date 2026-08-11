import { createFileRoute, Link } from "@tanstack/react-router";
import { X, Heart, Headphones, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { places } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "المفضلة — سمر" },
      { name: "description", content: "المواقع التراثية التي حفظتها لزيارتها والاستماع لقصصها لاحقاً." },
      { property: "og:title", content: "المفضلة — سمر" },
      { property: "og:description", content: "قائمة مواقعك التراثية المحفوظة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites, toggleFavorite } = useAppState();
  const list = places.filter((p) => favorites.includes(p.id));

  return (
    <AppShell>
      <PageHeader title="المفضلة" subtitle={`${list.length} موقع محفوظ`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5">
        {list.map((p) => (
          <article key={p.id} className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated group">
            {/* Remove Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(p.id);
              }}
              aria-label="إزالة من المفضلة"
              className="absolute top-3 end-3 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-destructive hover:scale-110 active:scale-95 shadow-md"
              title="إزالة من المفضلة"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Card Image */}
            <Link to="/place/$placeId" params={{ placeId: p.id }} className="block">
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-48 md:h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="veil absolute inset-0" />
                <span className="absolute bottom-3 start-4 text-base font-bold text-[oklch(0.98_0.01_84)]">
                  {p.name}
                </span>
              </div>
            </Link>

            {/* Card Info */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
              <Link to="/place/$placeId" params={{ placeId: p.id }} className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground hover:text-primary transition-colors">{p.tagline}</p>
                <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Headphones className="h-3.5 w-3.5" /> {p.stories} قصة
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" /> {p.rating}
                  </span>
                </p>
              </Link>
              {/* Heart button — already in fav so filled */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(p.id);
                }}
                aria-label="إزالة من المفضلة"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-destructive hover:border-destructive"
              >
                <Heart className="h-5 w-5 fill-current" />
              </button>
            </div>
          </article>
        ))}

        {list.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-base font-semibold text-muted-foreground">لا توجد مواقع مفضلة قائمة الآن.</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">اضغط على أيقونة القلب ❤️ في أي مكان لإضافته لمفضلتك!</p>
            <Link
              to="/explore"
              className="inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
            >
              + إضافة مواقع للمفضلة
            </Link>
          </div>
        ) : null}
      </div>

      {/* Add More Button */}
      {list.length > 0 && (
        <div className="px-5 pt-6 pb-4 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Heart className="h-4 w-4" />
            إضافة المزيد من المواقع
          </Link>
        </div>
      )}
    </AppShell>
  );
}
