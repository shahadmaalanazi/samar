import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Navigation, Compass, Sparkles, Locate, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { places, type Place } from "@/lib/data";
import { playClickSound, playSuccessSound } from "@/lib/sound-fx";
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

// Real GPS Coordinates for Saudi Heritage Landmarks
const LANDMARK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  diriyah: { lat: 24.7339, lng: 46.5746 }, // الدرعية — الرياض
  masmak: { lat: 24.6312, lng: 46.7132 },  // قصر المصمك — الرياض
  alula: { lat: 26.8016, lng: 37.9576 },   // العلا — مدائن صالح
  jeddah: { lat: 21.4858, lng: 39.1867 },  // جدة التاريخية — البلد
  ahsa: { lat: 25.4111, lng: 49.6865 },   // واحة الأحساء
  sharqiya: { lat: 26.5683, lng: 50.0575 },// الشرقية — تاروت
};

// Haversine formula to calculate distance in kilometers
function calculateKmDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function MapPage() {
  const [activeId, setActiveId] = useState(places[0]!.id);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [nearestInfo, setNearestInfo] = useState<{ place: Place; distance: number } | null>(null);
  const [distancesMap, setDistancesMap] = useState<Record<string, number>>({});
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const active = places.find((p) => p.id === activeId)!;

  // Locate User via Browser Geolocation API (100% Safe & Local)
  const locateNearestLandmark = () => {
    try {
      playClickSound();
    } catch {}

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setNoticeMsg("خاصية تحديد الموقع غير مدعومة في متصفحك الحالي.");
      return;
    }

    setLoadingLoc(true);
    setNoticeMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        // Calculate distance to all landmarks
        let closestPlace: Place = places[0]!;
        let minDistance = Infinity;
        const calculatedDistances: Record<string, number> = {};

        places.forEach((p) => {
          const coords = LANDMARK_COORDINATES[p.id];
          if (coords) {
            const dist = calculateKmDistance(userLat, userLng, coords.lat, coords.lng);
            calculatedDistances[p.id] = dist;
            if (dist < minDistance) {
              minDistance = dist;
              closestPlace = p;
            }
          }
        });

        setDistancesMap(calculatedDistances);
        setNearestInfo({ place: closestPlace, distance: minDistance });
        setActiveId(closestPlace.id);
        setLoadingLoc(false);

        try {
          playSuccessSound();
        } catch {}
      },
      (err) => {
        setLoadingLoc(false);
        if (err.code === err.PERMISSION_DENIED) {
          setNoticeMsg("🔒 تم رفض إذن تحديد الموقع. يمكنك تفعيله من إعدادات المتصفح لرؤية أقرب معلم لك.");
        } else {
          setNoticeMsg("تعذر تحديد الموقع الحالي فوراً. جرب مرة أخرى.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <AppShell>
      <PageHeader title="الخريطة التراثية" subtitle="اكتشف أقرب المعالم التراثية إليك" />

      {/* GPS Nearest Landmark Button */}
      <div className="px-5 mb-4">
        <button
          type="button"
          onClick={locateNearestLandmark}
          disabled={loadingLoc}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs font-extrabold text-foreground hover:bg-amber-500/20 transition-all shadow-sm cursor-pointer active:scale-98 disabled:opacity-50"
        >
          <Locate className={cn("h-4 w-4 text-amber-600 dark:text-amber-400", loadingLoc ? "animate-spin" : "")} />
          <span>{loadingLoc ? "جاري العثور على أقرب معلم…" : "📍 تحديد موقعي الحالي وإيجاد أقرب معلم تراثي"}</span>
        </button>

        {/* Safety Note */}
        <p className="mt-1.5 text-[10px] text-muted-foreground flex items-center justify-center gap-1 text-center">
          <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
          <span>تحديد الموقع آمن 100% ويتم محلياً على جهازك دون مشاركة بياناتك.</span>
        </p>

        {noticeMsg && (
          <p className="mt-2 text-xs text-destructive text-center font-semibold bg-destructive/10 p-2 rounded-xl">
            {noticeMsg}
          </p>
        )}
      </div>

      {/* Nearest Landmark Banner */}
      {nearestInfo && (
        <div className="mx-5 mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300">أقرب معلم تراثي لموقعك الحالي ✨</p>
                <p className="text-sm font-extrabold text-foreground">{nearestInfo.place.name}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-950 dark:text-emerald-200">
              يبعد {nearestInfo.distance} كم 🚗
            </span>
          </div>
        </div>
      )}

      {/* Map Container */}
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

          {places.map((p) => {
            const isSelected = p.id === activeId;
            const isNearest = nearestInfo?.place.id === p.id;
            const dist = distancesMap[p.id];

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  try {
                    playClickSound();
                  } catch {}
                  setActiveId(p.id);
                }}
                aria-label={p.name}
                style={{ insetInlineStart: `${p.coords.x}%`, top: `${p.coords.y}%` }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 transition-all duration-300 cursor-pointer",
                  isSelected ? "scale-125 z-20" : "opacity-80 hover:opacity-100"
                )}
              >
                <span
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border shadow-soft",
                    isNearest
                      ? "bg-amber-500 border-amber-400 text-amber-950 ring-4 ring-amber-400/40 animate-bounce"
                      : isSelected
                      ? "surface-brand border-primary text-primary-foreground shadow-glow"
                      : "border-border bg-card text-primary"
                  )}
                >
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="mt-1 block rounded-full bg-black/75 px-2 py-0.5 text-[9px] font-bold text-white whitespace-nowrap shadow-sm">
                  {p.name} {dist !== undefined ? `(${dist} كم)` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Landmark Card */}
      <div className="px-5 pt-4 pb-8">
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
              {distancesMap[active.id] !== undefined ? ` · يبعد ${distancesMap[active.id]} كم` : ""}
            </p>
          </div>
          <Link
            to="/place/$placeId"
            params={{ placeId: active.id }}
            className="surface-brand flex shrink-0 items-center gap-1 rounded-full px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-soft transition-transform duration-300 active:scale-95 cursor-pointer"
          >
            <Navigation className="h-3.5 w-3.5" />
            استكشف
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
