import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Clock, Trophy, X, HelpCircle, Sparkles, Check, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { useAppState } from "@/lib/app-state";
import { playSuccessSound, playClickSound } from "@/lib/sound-fx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "التحديات التفاعلية — سمر" },
      { name: "description", content: "اختبر معلوماتك عن التراث السعودي واجمع النقاط عبر تحديات تفاعلية." },
      { property: "og:title", content: "التحديات التفاعلية — سمر" },
      { property: "og:description", content: "تحديات ممتعة في كل موقع تراثي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengesPage,
});

export type QuizChallenge = {
  id: string;
  title: string;
  place: string;
  points: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

export const quizChallenges: QuizChallenge[] = [
  {
    id: "c1",
    title: "اعثر على الباب القديم",
    place: "الدرعية التاريخية",
    points: 100,
    question: "في أي حي تراثي عريق مسجل لدى اليونسكو يقع قصر سلوى ومهد الدولة السعودية الأولى؟",
    options: ["حي الطريف", "حي البجيري", "حي المربّع", "حي الضهيرة"],
    correctIndex: 0,
    explanation: "حي الطريف بالدرعية هو مهد الدولة السعودية الأولى ومدرج ضمن قائمة التراث العالمي لليونسكو.",
  },
  {
    id: "c2",
    title: "ما اسم هذا البرج؟",
    place: "قصر المصمك — الرياض",
    points: 100,
    question: "كم عدد الأبراج الرئيسية المصنوعة من الطين والطوب الرملي في أركان قصر المصمك؟",
    options: ["برجان", "ثلاثة أبراج", "أربعة أبراج", "ستة أبراج"],
    correctIndex: 2,
    explanation: "يضم قصر المصمك التاريخي أربعة أبراج رئيسية في أركانه الأربعة يبلغ ارتفاع كل منها حوالي 18 متراً.",
  },
  {
    id: "c3",
    title: "اكتشف النقش المخفي",
    place: "العلا — مدائن صالح",
    points: 150,
    question: "ما هي الحضارة القديمة التي نحتت الواجهات الجبلية والمقابر الفاخرة في موقع الحجر بالعلا؟",
    options: ["حضارة الأنباط", "الحضارة الفيروزية", "الآشوريون", "الرومان"],
    correctIndex: 0,
    explanation: "نحت الأنباط أكثر من 110 مقابر جبلية مهيبة في الحجر بالعلا قبل أكثر من 2000 عام.",
  },
  {
    id: "c4",
    title: "أين يقع هذا السوق؟",
    place: "جدة التاريخية (البلد)",
    points: 100,
    question: "ما اسم التغطية الخشبية المزخرفة المتميزة لنوافذ وشرفات المباني في جدة التاريخية؟",
    options: ["الرواشين", "السدو", "المقرنصات", "المحاريب"],
    correctIndex: 0,
    explanation: "الرواشين هي التحف الخشبية الرائعة التي تمتاز بها بيوت جدة التاريخية لتوفير التهوية والخصوصية.",
  },
  {
    id: "c5",
    title: "سمِّ عيون الأحساء",
    place: "واحة الأحساء",
    points: 120,
    question: "بماذا تُعرف واحة الأحساء في موسوعة جينيس العالمية وقائمة التراث العالمي؟",
    options: [
      "أكبر واحة نخيل قائمة بذاتها في العالم",
      "أعلى قمة جبلية في الجزيرة العربية",
      "أكبر صحراء رملية متصلة",
      "أطول مجرى مائي طبيعي",
    ],
    correctIndex: 0,
    explanation: "تضم واحة الأحساء أكثر من 2.5 مليون نخلة وتعتبر أكبر واحة نخيل مستقلة في العالم.",
  },
  {
    id: "c6",
    title: "حكاية الغوص",
    place: "المنطقة الشرقية",
    points: 90,
    question: "ما هي المهنة التراثية البحرية الشهيرة التي مارسها أهالي الساحل الشرقي لقرون طويلة؟",
    options: ["الغوص على اللؤلؤ", "صناعة الفخار النبطي", "زراعة الزيتون", "نحت الرخام"],
    correctIndex: 0,
    explanation: "كانت رحلات الغوص على اللؤلؤ عصب الحياة الاقتصادية والتراثية في الخليج العربي والشرقية.",
  },
];

const filters = [
  { id: "all", label: "الكل" },
  { id: "done", label: "مكتملة" },
  { id: "pending", label: "غير مكتملة" },
];

function ChallengesPage() {
  const { completedChallenges, toggleChallenge, userPoints } = useAppState();
  const [filter, setFilter] = useState("all");
  const [activeQuiz, setActiveQuiz] = useState<QuizChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const list = quizChallenges.filter((c) => {
    const isDone = completedChallenges.includes(c.id);
    if (filter === "done") return isDone;
    if (filter === "pending") return !isDone;
    return true;
  });

  const openQuiz = (quiz: QuizChallenge) => {
    setActiveQuiz(quiz);
    setSelectedOption(null);
    setIsAnswered(completedChallenges.includes(quiz.id));
    try {
      playClickSound();
    } catch {}
  };

  const handleSelectOption = (index: number) => {
    if (!activeQuiz) return;
    setSelectedOption(index);
    const isCorrect = index === activeQuiz.correctIndex;

    if (isCorrect) {
      try {
        playSuccessSound();
      } catch {}
      setIsAnswered(true);
      if (!completedChallenges.includes(activeQuiz.id)) {
        toggleChallenge(activeQuiz.id, activeQuiz.points);
      }
    } else {
      try {
        playClickSound();
      } catch {}
    }
  };

  return (
    <AppShell>
      <PageHeader title="التحديات التفاعلية" subtitle="اجب عن الأسئلة واكسب النقاط" />

      {/* Points Banner */}
      <div className="mx-5 mb-4 flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-amber-950 font-bold">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">رصيد نقاطك الحالي</p>
            <p className="text-base font-extrabold text-foreground">{userPoints} نقطة</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-900 dark:text-amber-300">
          {completedChallenges.length} من {quizChallenges.length} مكتمل
        </span>
      </div>

      <div className="flex gap-2 px-5">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="space-y-3 px-5 pt-5 pb-8">
        {list.map((c) => {
          const isDone = completedChallenges.includes(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => openQuiz(c)}
                className={cn(
                  "w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-4 shadow-card transition-all text-start cursor-pointer hover:scale-[1.01]",
                  isDone
                    ? "border-primary/50 bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                    isDone ? "surface-brand text-primary-foreground" : "bg-secondary text-primary"
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-6 w-6" /> : <HelpCircle className="h-6 w-6" />}
                </span>
                <div className="min-w-0">
                  <p className={cn("truncate text-sm font-bold", isDone ? "text-primary" : "text-foreground")}>
                    {c.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{c.place}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-colors",
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : "bg-amber-500/20 text-amber-900 dark:text-amber-300"
                  )}
                >
                  {isDone ? `مكتمل (+${c.points})` : `+${c.points} نقطة`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* QUIZ QUESTION MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 pb-24 md:pb-32 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[82vh] overflow-y-auto hide-scrollbar rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveQuiz(null)}
              className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl surface-brand text-primary-foreground shadow-glow">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">{activeQuiz.title}</h3>
                <p className="text-xs text-muted-foreground">{activeQuiz.place}</p>
              </div>
              <span className="ms-auto shrink-0 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-extrabold text-amber-900 dark:text-amber-300">
                +{activeQuiz.points} نقطة
              </span>
            </div>

            {/* Question */}
            <div className="mt-5 rounded-2xl bg-secondary/60 p-4 border border-border">
              <p className="text-sm font-bold text-foreground leading-relaxed">
                {activeQuiz.question}
              </p>
            </div>

            {/* Options */}
            <div className="mt-4 space-y-2.5">
              {activeQuiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeQuiz.correctIndex;
                const isAlreadyDone = completedChallenges.includes(activeQuiz.id);

                let btnStyle = "border-border bg-card hover:border-primary/50 text-foreground";
                if (isAlreadyDone && isCorrect) {
                  btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-bold";
                } else if (selectedOption !== null) {
                  if (isCorrect && isSelected) {
                    btnStyle = "border-emerald-500 bg-emerald-500 text-white font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "border-rose-500 bg-rose-500/15 text-rose-950 dark:text-rose-200 font-bold";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-2xl border p-3.5 text-sm transition-all text-start cursor-pointer shadow-sm",
                      btnStyle
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>

                    {/* Result Status Icon */}
                    {isAlreadyDone && isCorrect ? (
                      <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : selectedOption === idx ? (
                      isCorrect ? (
                        <Check className="h-5 w-5 text-white shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                      )
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Explanation */}
            {selectedOption !== null && (
              <div
                className={cn(
                  "mt-4 rounded-2xl p-4 text-xs leading-relaxed animate-in fade-in duration-300",
                  selectedOption === activeQuiz.correctIndex
                    ? "bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-950 dark:text-rose-200 border border-rose-500/30"
                )}
              >
                {selectedOption === activeQuiz.correctIndex ? (
                  <div>
                    <p className="font-extrabold text-sm mb-1">إجابة صحيحة! 🎉 (+{activeQuiz.points} نقطة)</p>
                    <p>{activeQuiz.explanation}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-extrabold text-sm mb-1">إجابة غير صحيحة ❌</p>
                    <p>حاول اختيار الإجابة المناسبة مرة أخرى!</p>
                  </div>
                )}
              </div>
            )}

            {/* Close / Action Button */}
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveQuiz(null)}
                className="surface-brand rounded-full px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-glow cursor-pointer"
              >
                {completedChallenges.includes(activeQuiz.id) ? "ممتاز، إغلاق" : "إغلاق التحدي"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
