import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowLeft, Headphones, Mic } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ThemeToggle, LangToggle } from "@/components/chrome";
import { PlaceTile, PlaceCard } from "@/components/place-card";
import { places } from "@/lib/data";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "الرئيسية — سمر" },
      { name: "description", content: "اكتشف المناطق التراثية السعودية، ابحث عن مكان واستمع لقصته." },
      { property: "og:title", content: "الرئيسية — سمر" },
      { property: "og:description", content: "اكتشف المناطق التراثية السعودية واستمع لقصصها." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

import { BlindModeButton } from "@/components/blind-mode-button";

export function HomePage() {
  return (
    <AppShell>
      <header className="flex items-center justify-between gap-3 px-5 pt-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="شعار سمر" className="h-12 w-auto object-contain shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-foreground">السلام عليكم</p>
            <p className="truncate text-xs text-muted-foreground">إلى أين تريد السفر اليوم؟</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* 🔊 نمط سَمَر الشامل (للمكفوفين) */}
      <div className="px-5 pt-4">
        <BlindModeButton />
      </div>

      <div className="px-5 pt-4">
        <Link
          to="/explore"
          className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3.5 shadow-elevated"
        >
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
          <span className="flex-1 text-sm text-muted-foreground">ابحث عن مكان…</span>
          <ArrowLeft className="h-4 w-4 text-primary" />
        </Link>
      </div>

      <section className="px-5 pt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">اكتشف المناطق</h2>
          <Link to="/map" className="text-xs text-primary">
            الخريطة
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {places.map((p) => (
            <PlaceTile key={p.id} place={p} />
          ))}
        </div>
      </section>

      <section className="px-5 pt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">جولة صوتية مميزة</h2>
          <Link to="/explore" className="text-xs text-primary">
            الكل
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlaceCard place={places[1]!} />
          <PlaceCard place={places[0]!} />
        </div>
      </section>

      <section className="px-5 pt-8">
        <Link
          to="/chat"
          className="surface-card flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-elevated transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="surface-brand flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-primary-foreground shadow-glow">
            <Mic className="h-5.5 w-5.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">اسأل راوي المكان</p>
            <p className="truncate text-xs text-muted-foreground">
              اكتشف التاريخ كما لم تسمعه من قبل
            </p>
          </div>
          <Headphones className="ms-auto h-5 w-5 shrink-0 text-primary" />
        </Link>
      </section>
    </AppShell>
  );
}
