import { Link } from "@tanstack/react-router";
import { Heart, Headphones, Star } from "lucide-react";
import type { Place } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function PlaceTile({ place }: { place: Place }) {
  return (
    <Link
      to="/place/$placeId"
      params={{ placeId: place.id }}
      className="group relative block overflow-hidden rounded-3xl shadow-elevated transition-transform duration-300 hover:-translate-y-0.5"
    >
      <img
        src={place.image}
        alt={place.name}
        loading="lazy"
        width={800}
        height={600}
        className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="veil absolute inset-0" />
      <span className="absolute bottom-2 start-3 text-sm font-bold text-[oklch(0.98_0.01_84)]">
        {place.name}
      </span>
    </Link>
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
            className="h-44 w-full object-cover"
          />
          <div className="veil absolute inset-0" />
          <span className="absolute bottom-3 start-4 text-base font-bold text-[oklch(0.98_0.01_84)]">
            {place.name}
          </span>
        </div>
      </Link>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{place.tagline}</p>
          <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Headphones className="h-3.5 w-3.5" /> {place.stories} قصة
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" /> {place.rating}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(place.id)}
          aria-label="إضافة للمفضلة"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors",
            fav ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
          )}
        >
          <Heart className={cn("h-4.5 w-4.5", fav && "fill-current")} />
        </button>
      </div>
    </article>
  );
}
