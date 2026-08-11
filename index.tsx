import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/samar-logo.png.asset.json";
import hero from "@/assets/hero-valley.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سمر — حيث تحكي الأماكن قصصها" },
      { name: "description", content: "تطبيق سمر للتراث السعودي: قصص صوتية، راوي ذكي، وتحديات تفاعلية في أجمل المواقع التراثية." },
      { property: "og:title", content: "سمر — حيث تحكي الأماكن قصصها" },
      { property: "og:description", content: "اكتشف التراث السعودي بالصوت والقصة مع تطبيق سمر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const id = setInterval(() => setProgress((p) => Math.min(100, p + 3)), 70);
    const t = setTimeout(() => navigate({ to: "/onboarding" }), 2800);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [navigate]);

  return (
    <div className="surface-warm flex min-h-screen justify-center">
      <button
        type="button"
        onClick={() => navigate({ to: "/onboarding" })}
        className="relative flex min-h-screen w-full max-w-lg flex-col items-center justify-between overflow-hidden bg-background text-center"
      >
        <div className="flex flex-1 flex-col items-center justify-center px-8 pt-16">
          <img
            src={logo.url}
            alt="شعار سمر"
            width={480}
            height={264}
            className="w-64 animate-in fade-in zoom-in-95 duration-1000"
          />
          <p className="mt-6 font-display text-xl leading-relaxed text-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000">
            حيثُ تَحكي الأمَاكنُ قَصصَها
          </p>
          <p className="mt-2 text-[10px] tracking-[0.35em] text-muted-foreground">
            WHERE PLACES TELL THEIR STORIES
          </p>

          <div className="mt-8 h-1.5 w-44 overflow-hidden rounded-full bg-secondary">
            <div
              className="surface-brand h-full rounded-full transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <img
          src={hero}
          alt="وادٍ صحراوي وقلعة طينية"
          width={1200}
          height={900}
          className="h-[45vh] w-full object-cover"
        />
        <div className="veil pointer-events-none absolute inset-x-0 bottom-0 h-[45vh]" />
        <p className="absolute bottom-8 w-full text-xs tracking-wide text-[oklch(0.95_0.01_84)]">
          جارٍ استحضار القصة…
        </p>
      </button>
    </div>
  );
}
