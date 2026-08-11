import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { places } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "الخريطة التراثية — سمر" },
      { name: "description", content: "استعرض المواقع التراثية السعودية على خريطة تفاعلية واختر وجهتك." },
      { property: "og:title", content: "الخريطة التراثية — سمر" },
      { property: "og:description", content: "مواقع التراث السعودي على خريطة واحدة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [activeId, setActiveId] = useState(places[0]!.id);
  const active = places.find((p) => p.id === activeId)!;

  return (
    <AppShell>
      <PageHeader title="الخريطة" subtitle="المواقع التراثية القريبة" />

      <div className="px-5">
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border bg-sand shadow-elevated">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 25%, var(--color-secondary), transparent 55%), radial-gradient(circle at 70% 70%, var(--color-secondary), transparent 50%)",
            }}
          />
          <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
            <defs>
              <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="var(--color-border)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {places.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              aria-label={p.name}
              style={{ insetInlineStart: `${p.coords.x}%`, top: `${p.coords.y}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 transition-transform",
                p.id === activeId ? "scale-110" : "opacity-80",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border shadow-soft",
                  p.id === activeId
                    ? "surface-brand border-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card text-primary",
                )}
              >
                <MapPin className="h-4.5 w-4.5" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="surface-card grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-elevated">
          <img
            src={active.image}
            alt={active.name}
            loading="lazy"
            width={800}
            height={600}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{active.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {active.region} · {active.stories} قصة
            </p>
          </div>
          <Link
            to="/place/$placeId"
            params={{ placeId: active.id }}
            className="surface-brand flex shrink-0 items-center gap-1 rounded-full px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-soft transition-transform duration-300 active:scale-95"
          >
            <Navigation className="h-3.5 w-3.5" />
            زيارة
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
