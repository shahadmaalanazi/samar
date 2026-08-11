import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Compass, Search, Trophy } from "lucide-react";
import alula from "@/assets/alula.jpg";
import diriyah from "@/assets/diriyah.jpg";
import masmak from "@/assets/masmak.jpg";
import { cn } from "@/lib/utils";

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
  { title: "اسمع التاريخ…", sub: "كل مكان لديه قصة.", image: alula },
  { title: "تحدث مع راوي المكان.", sub: "اضغط وتحدث.", image: diriyah },
  { title: "عش التجربة.", sub: "", image: masmak },
];

const bullets = [
  { icon: Search, label: "اسأل." },
  { icon: Compass, label: "اكتشف." },
  { icon: Trophy, label: "اجمع الإنجازات." },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const slide = slides[step]!;
  const last = step === slides.length - 1;

  return (
    <div className="surface-warm flex min-h-screen justify-center">
      <div className="relative flex min-h-screen w-full max-w-lg flex-col overflow-hidden bg-background">
        <div className="flex justify-start px-5 pt-6">
          <Link to="/home" className="text-xs text-muted-foreground hover:text-foreground">
            تخطي
          </Link>
        </div>

        <div className="px-8 pt-6 text-center">
          <h1 key={step} className="page-enter font-display text-4xl leading-snug text-foreground">{slide.title}</h1>
          {slide.sub ? <p className="mt-2 text-sm text-muted-foreground">{slide.sub}</p> : null}
        </div>

        <div className="relative mt-6 flex-1">
          <img
            key={slide.image}
            src={slide.image}
            alt=""
            width={800}
            height={600}
            className="page-enter h-full w-full object-cover"
          />
          <div className="veil absolute inset-0" />
          {step === 1 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[oklch(0.85_0.06_70)] bg-[oklch(0.97_0.01_84)] text-primary shadow-glow">
                <Mic className="h-8 w-8" />
              </span>
            </div>
          ) : null}
          {step === 2 ? (
            <ul className="absolute inset-x-0 top-6 mx-auto w-fit space-y-4">
              {bullets.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-full bg-card/85 px-5 py-2 text-sm font-semibold text-foreground backdrop-blur"
                >
                  <Icon className="h-4.5 w-4.5 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="space-y-4 px-8 pb-10 pt-6">
          <div className="flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-border",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => (last ? navigate({ to: "/home" }) : setStep((s) => s + 1))}
            className="surface-brand w-full rounded-full py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform duration-300 active:scale-[0.98]"
          >
            {last ? "ابدأ الرحلة" : "التالي"}
          </button>
        </div>
      </div>
    </div>
  );
}
