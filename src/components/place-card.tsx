import { Link } from "@tanstack/react-router";
import { Heart, Headphones, Star } from "lucide-react";
import type { Place } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function PlaceTile({ place }: { place: Place }) {
  const { isFavorite, toggleFavorite } = useAppState();
  const fav = isFavorite(place.id);

  return (
    <div className="group relative block overflow-hidden rounded-3xl shadow-elevated transition-transform duration-300 hover:-translate-y-0.5">
      <Link to="/place/$placeId" params={{ placeId: place.id }} className="relative block h-full w-full">
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          width={800}
          height={600}
          className="h-32 md:h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="veil absolute inset-0" />
        <span className="absolute bottom-3 start-4 text-sm font-bold text-[oklch(0.98_0.01_84)] z-10">
          {place.name}
        </span>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(place.id);
        }}
        aria-label="إضافة للمفضلة"
        className={cn(
          "absolute top-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-transform active:scale-95 cursor-pointer shadow-md",
          fav ? "bg-primary text-white" : "bg-black/40 text-white hover:bg-black/60",
        )}
      >
        <Heart className={cn("h-4 w-4", fav && "fill-current")} />
      </button>
    </div>
  );
}

export function PlaceCard({ place }: { place: Place }) {
  const { isFavorite, toggleFavorite } = useAppState();
  const fav = isFavorite(place.id);

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      <Link to="/place/$placeId" params={{ placeId: place.id }} className="block">
        <div className="relative">
          <img
            src={place.image}
            alt={place.name}
            loading="lazy"
            width={800}
            height={600}
            className="h-48 md:h-52 w-full object-cover"
          />
          <div className="veil absolute inset-0" />
          <span className="absolute bottom-3 start-4 text-base font-bold text-[oklch(0.98_0.01_84)]">
            {place.name}
          </span>
        </div>
      </Link>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
        <Link to="/place/$placeId" params={{ placeId: place.id }} className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground hover:text-primary transition-colors">{place.tagline}</p>
          <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Headphones className="h-3.5 w-3.5" /> {place.stories} قصة
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" /> {place.rating}
            </span>
          </p>
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(place.id);
          }}
          aria-label={fav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          className={cn(
            "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 active:scale-95",
            fav
              ? "border-primary bg-primary text-primary-foreground shadow-md"
              : "border-border bg-secondary text-foreground hover:border-primary hover:text-primary",
          )}
        >
          <Heart className={cn("h-5 w-5", fav && "fill-current")} />
        </button>
      </div>
    </article>
  );
}
