import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mic, Square, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { chatSuggestions } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "راوي المكان — المساعد الصوتي" },
      { name: "description", content: "تحدث مع راوي المكان واستمع لقصص المواقع التراثية بالصوت." },
      { property: "og:title", content: "راوي المكان — المساعد الصوتي" },
      { property: "og:description", content: "اضغط وتحدث، ودع المكان يحكي لك قصته." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoicePage,
});

function VoicePage() {
  const [listening, setListening] = useState(false);
  const [bars, setBars] = useState<number[]>(Array.from({ length: 32 }, () => 0.2));

  useEffect(() => {
    if (!listening) return;
    const id = setInterval(
      () => setBars(Array.from({ length: 32 }, () => 0.15 + Math.random() * 0.85)),
      120,
    );
    return () => clearInterval(id);
  }, [listening]);

  return (
    <AppShell>
      <PageHeader title="راوي المكان" subtitle={listening ? "يتحدث الآن…" : "اضغط وتحدث"} />

      <div className="flex flex-col items-center px-5 pt-6">
        <div className="surface-card flex h-28 w-full items-center justify-center gap-1 rounded-3xl border border-border bg-card px-4 shadow-elevated">
          {bars.map((b, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-linear-to-t from-primary/40 to-primary transition-all duration-150 ease-out"
              style={{ height: `${(listening ? b : 0.18) * 100}%` }}
            />
          ))}
        </div>

        <div className="relative mt-10 flex items-center justify-center">
          {listening ? (
            <>
              <span className="pulse-ring absolute h-28 w-28 rounded-full bg-primary/25" />
              <span
                className="pulse-ring absolute h-28 w-28 rounded-full bg-primary/20"
                style={{ animationDelay: "0.6s" }}
              />
            </>
          ) : null}
        <button
          type="button"
          onClick={() => setListening((v) => !v)}
          className={cn(
            "relative flex h-28 w-28 items-center justify-center rounded-full shadow-glow transition-transform duration-300 hover:scale-105 active:scale-95",
            listening
              ? "bg-destructive text-destructive-foreground"
              : "surface-brand text-primary-foreground",
          )}
          aria-label={listening ? "إيقاف" : "ابدأ التحدث"}
        >
          {listening ? <Square className="h-9 w-9" /> : <Mic className="h-10 w-10" />}
        </button>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          {listening ? "جارٍ الاستماع…" : "اضغط على الميكروفون لبدء المحادثة"}
        </p>

        <div className="mt-8 w-full">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" /> جرّب أن تسأل
          </p>
          <div className="flex flex-wrap gap-2">
            {chatSuggestions.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Link
          to="/chat"
          className="mt-8 w-full rounded-full border border-border bg-card py-3 text-center text-sm font-bold text-foreground"
        >
          التبديل إلى المحادثة الكتابية
        </Link>
      </div>
    </AppShell>
  );
}
