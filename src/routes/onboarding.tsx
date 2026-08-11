import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Compass, Search, Trophy } from "lucide-react";
import alula from "@/assets/alula.jpg";
import diriyah from "@/assets/diriyah.jpg";
import masmak from "@/assets/masmak.jpg";
import { cn } from "@/lib/utils";
import { playClickSound, playSlideSound, playSuccessSound } from "@/lib/sound-fx";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "ابدأ رحلتك مع سمر" },
      { name: "description", content: "تعرّف على سمر: اسمع التاريخ، تحدث مع راوي المكان، وعش التجربة التراثية." },
      { property: "og:title", content: "ابدأ رحلتك مع سمر" },
      { property: "og:description", content: "ثلاث خطوات قصيرة قبل أن تبدأ رحلتك في التراث السعودي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    title: "اسمع التاريخ…",
    sub: "كل مكان لديه قصة.",
    image: alula,
    showBullets: false,
    showMic: false,
  },
  {
    title: "تحدث مع راوي المكان.",
    sub: "اضغط وتحدث.",
    image: diriyah,
    showBullets: false,
    showMic: true,
  },
  {
    title: "عش التجربة.",
    sub: "",
    image: masmak,
    showBullets: true,
    showMic: false,
  },
];

const bullets = [
  { icon: Search, label: "اسأل." },
  { icon: Compass, label: "اكتشف." },
  { icon: Trophy, label: "اجمع الإنجازات." },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const slide = slides[step]!;
  const last = step === slides.length - 1;

  const handleNext = () => {
    // 1. Play sound with bulletproof safety wrapper so audio errors never block navigation
    try {
      if (last) {
        playSuccessSound();
      } else {
        playSlideSound();
      }
    } catch {
      // Audio error ignored
    }

    // 2. Immediate state / navigation transition
    if (last) {
      window.location.href = "/home";
    } else {
      setStep((prev) => Math.min(prev + 1, slides.length - 1));
    }
  };

  const handleDotClick = (index: number) => {
    try {
      playClickSound();
    } catch {
      // Ignore audio error
    }
    setStep(index);
  };

  return (
    <div className="surface-warm flex min-h-screen justify-center">
      <div className="relative flex min-h-screen w-full max-w-lg flex-col overflow-hidden bg-background">

        {/* Skip */}
        <div className="flex justify-start px-5 pt-6">
          <a
            href="/home"
            onClick={() => {
              try {
                playClickSound();
              } catch {}
            }}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            تخطي
          </a>
        </div>

        {/* Title */}
        <div className="px-8 pt-6 text-center">
          <h1 key={`title-${step}`} className="animate-in fade-in slide-in-from-top-4 duration-500 font-display text-4xl leading-snug text-foreground">
            {slide.title}
          </h1>
          {slide.sub ? (
            <p key={`sub-${step}`} className="animate-in fade-in duration-500 mt-2 text-sm text-muted-foreground">
              {slide.sub}
            </p>
          ) : null}
        </div>

        {/* Image & Interactive Overlays */}
        <div className="relative mt-6 flex-1 h-[340px] min-h-[260px] shrink-0 overflow-hidden">
          <img
            key={`img-${step}`}
            src={slide.image}
            alt=""
            width={800}
            height={600}
            className="animate-in fade-in zoom-in-95 duration-500 h-full w-full object-cover"
          />
          <div className="veil absolute inset-0" />

          {/* Mic overlay */}
          {slide.showMic ? (
            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-75 duration-500">
              <span className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/40 bg-card/90 text-primary shadow-glow animate-pulse">
                <Mic className="h-10 w-10 text-primary" />
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
              </span>
            </div>
          ) : null}

          {/* Bullets overlay */}
          {slide.showBullets ? (
            <ul className="absolute inset-x-0 top-6 mx-auto w-fit space-y-3">
              {bullets.map(({ icon: Icon, label }, idx) => (
                <li
                  key={label}
                  style={{ animationDelay: `${idx * 120}ms` }}
                  className="animate-in slide-in-from-bottom-3 fade-in duration-400 flex items-center gap-3 rounded-full bg-card/90 px-6 py-2.5 text-sm font-bold text-foreground backdrop-blur shadow-md hover:scale-105 transition-transform"
                >
                  <Icon className="h-4.5 w-4.5 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Dots + Button */}
        <div className="relative z-20 space-y-5 px-8 pb-10 pt-6">
          {/* Clickable dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDotClick(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125",
                  i === step ? "w-8 bg-primary shadow-sm" : "w-2 bg-border hover:bg-primary/50",
                )}
                aria-label={`الشريحة ${i + 1}`}
              />
            ))}
          </div>

          {/* Next / Start button without arrow */}
          <button
            type="button"
            id="onboarding-next-btn"
            onClick={handleNext}
            className="surface-brand w-full cursor-pointer rounded-full py-4 text-base font-bold text-primary-foreground shadow-glow transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.96] flex items-center justify-center"
          >
            <span>{last ? "ابدأ الرحلة" : "التالي"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
