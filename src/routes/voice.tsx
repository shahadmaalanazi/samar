import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Mic, Square, Sparkles, Volume2, VolumeX, Send, RefreshCw, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { chatSuggestions, places } from "@/lib/data";
import { cn } from "@/lib/utils";
import { playClickSound, playMicSound } from "@/lib/sound-fx";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "راوي المكان — المساعد الصوتي" },
      { name: "description", content: "تحدث مع راوي المكان واستمع لقصص المواقع التراثية بالصوت والكتابة." },
      { property: "og:title", content: "راوي المكان — المساعد الصوتي" },
      { property: "og:description", content: "اضغط وتحدث، ودع المكان يحكي لك قصته بالصوت والكتابة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoicePage,
});

// Smart Heritage Answer Engine
function generateHeritageAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("مصمك") || q.includes("بنى")) {
    return "بُني قصر المصمك في عام 1895م في عهد الإمام عبد الله بن فيصل، وشهد انطلاقة توحيد المملكة على يد الملك عبد العزيز عام 1902م. يُعد حصناً طينياً عريقاً في قلب الرياض.";
  }
  if (q.includes("علا") || q.includes("أنباط") || q.includes("حجر")) {
    return "العلا تضم موقع 'الحِجر' وهو أول موقع سعودي يُدرج ضمن قائمة اليونسكو للتراث العالمي. تشتهر بمقابر الأنباط المنحوتة في الجبال وتاريخ يتجاوز 2000 عام.";
  }
  if (q.includes("درعية") || q.includes("طريف") || q.includes("وقت")) {
    return "الدرعية هي مهد الدولة السعودية الأولى وحي الطريف المسجل في اليونسكو. أفضل وقت لزيارتها هو خلال فصلي الشتاء والخريف للاستمتاع بالأجواء والمطاعم التراثية.";
  }
  if (q.includes("جدة") || q.includes("بلد")) {
    return "جدة التاريخية (البلد) تمتاز برواشينها الخشبية الجميلة ومساجدها الحجرية العتيقة، وكانت البوابة الرئيسية لحجاج بيت الله الحرام عبر التاريخ.";
  }
  if (q.includes("أحساء") || q.includes("نخيل") || q.includes("واحة")) {
    return "واحة الأحساء هي أكبر واحة نخيل قائمة بذاتها في العالم بـ 2.5 مليون نخلة، وتضم مواقع أثرية مثل جبل القارة وقصر إبراهيم التراثي.";
  }
  if (q.includes("300") || q.includes("سنة") || q.includes("قبل")) {
    return "قبل 300 سنة كانت الجزيرة العربية تشهد بداية تأسيس الدرعية وازدهار طرق التجارة والحج واستقرار البلدات التراثية العريقة.";
  }

  const matchedPlace = places.find((p) => q.includes(p.name.toLowerCase()));
  if (matchedPlace) {
    return `${matchedPlace.name} (${matchedPlace.tagline}): ${matchedPlace.description}`;
  }

  return `أهلاً بك! "${query}" سؤال تراثي قيّم. التراث السعودي غني بالحكايات والمعالم التراثية المجيدة المسجلة في قائمة التراث العالمي.`;
}

function VoicePage() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [textInput, setTextInput] = useState("");
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [response, setResponse] = useState(
    "أهلاً بك! أنا راوي سمر الذكي. اضغط على زر المايك للتحدث صوتاً، أو اكتب سؤالك في الحقل أسفله وسأجيبك فوراً بالنص والصوت!",
  );
  const [bars, setBars] = useState<number[]>(Array.from({ length: 32 }, () => 0.25));

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Visualizer Animation
  useEffect(() => {
    if (!listening && !speaking) return;
    const id = setInterval(
      () => setBars(Array.from({ length: 32 }, () => 0.2 + Math.random() * 0.8)),
      100,
    );
    return () => clearInterval(id);
  }, [listening, speaking]);

  // TTS Read aloud
  const speakText = (text: string) => {
    if (!synthRef.current) return;
    try {
      synthRef.current.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.95;

      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);

      const voices = synthRef.current.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith("ar"));
      if (arVoice) u.voice = arVoice;

      synthRef.current.speak(u);
    } catch {
      setSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch {
        // Ignore
      }
      setSpeaking(false);
    }
  };

  // AI Ask Processor with Fetch Timeout & Reliable Fallback
  const askAI = async (question: string) => {
    stopSpeaking();
    setUserQuery(question);
    setLoading(true);
    setMicNotice(null);
    setResponse(`جاري تحضير القصة بصوت الراوي عن: "${question}"...`);

    let reply = "";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, site: "التراث السعودي" }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.answer) reply = data.answer;
      }
    } catch {
      // Fallback seamlessly on timeout or network fail
    }

    if (!reply) {
      reply = generateHeritageAnswer(question);
    }

    setLoading(false);
    setResponse(reply);
    speakText(reply);
  };

  // Microphone STT Handler with safety fallbacks
  const startListening = () => {
    stopSpeaking();
    playMicSound();
    setMicNotice(null);

    if (typeof window === "undefined") return;

    const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!Speech) {
      setMicNotice("المتصفح لا يدعم الميكروفون المباشر. يسعدني إجابتك عند الكتابة في الحقل أدناه!");
      return;
    }

    try {
      const recog = new Speech();
      recog.lang = "ar-SA";
      recog.interimResults = false;

      recog.onstart = () => {
        setListening(true);
      };

      recog.onresult = (e: any) => {
        setListening(false);
        const transcript = e.results[0][0]?.transcript;
        if (transcript && transcript.trim()) {
          askAI(transcript.trim());
        }
      };

      recog.onerror = (err: any) => {
        setListening(false);
        if (err.error === "not-allowed") {
          setMicNotice("يرجى إعطاء الإذن للمتصفح لاستخدام الميكروفون، أو استخدام الكتابة أدناه.");
        } else {
          setMicNotice("لم يتم التعرّف على الصوت. يمكنك تجربة اختيار أحد الأسئلة المقترحة أو الكتابة.");
        }
      };

      recog.onend = () => {
        setListening(false);
      };

      recog.start();
    } catch (err) {
      setListening(false);
      setMicNotice("حدث خطأ أثناء تشغيل الميكروفون. يسعدنا استقبال سؤالك كتابةً أدناه!");
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || loading) return;
    playClickSound();
    const query = textInput.trim();
    setTextInput("");
    askAI(query);
  };

  return (
    <AppShell className="pb-24">
      <PageHeader
        title="راوي المكان"
        subtitle={listening ? "🎙️ يستمع إليك الآن..." : speaking ? "🔊 يتحدث الآن..." : "تحدث صوتاً أو اكتب للراوي"}
      />

      <div className="flex flex-col items-center px-4 pt-2 pb-10 max-w-2xl mx-auto w-full">
        
        {/* User Question Badge */}
        {userQuery ? (
          <div className="mb-3 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary flex items-center gap-2">
            <span>سؤالك:</span>
            <span className="text-foreground font-semibold">"{userQuery}"</span>
          </div>
        ) : null}

        {/* AI Response Card */}
        <div className="surface-card flex flex-col items-center justify-center p-6 rounded-[2rem] border border-border bg-card w-full shadow-elevated text-center min-h-[160px] relative">
          
          {/* Animated Audio Bars */}
          <div className="flex items-center justify-center gap-1.5 h-10 w-full mb-3">
            {bars.map((b, i) => (
              <span
                key={i}
                className={cn(
                  "w-1.5 rounded-full transition-all duration-150 ease-out",
                  listening
                    ? "bg-destructive animate-pulse"
                    : speaking
                    ? "bg-primary animate-bounce"
                    : "bg-muted-foreground/30",
                )}
                style={{ height: `${(listening || speaking ? b : 0.25) * 100}%` }}
              />
            ))}
          </div>

          {/* Answer Text */}
          <p className="text-base font-semibold text-foreground leading-relaxed px-2">
            {loading ? (
              <span className="flex items-center justify-center gap-2 text-primary animate-pulse">
                <RefreshCw className="h-4 w-4 animate-spin" /> جاري التفكير وإعداد الإجابة الصوتية...
              </span>
            ) : (
              response
            )}
          </p>

          {/* Audio Controls */}
          {!loading && response && (
            <div className="mt-4 flex items-center justify-center gap-3">
              {speaking ? (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/30 px-4 py-1.5 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all cursor-pointer shadow-sm"
                >
                  <VolumeX className="h-3.5 w-3.5" /> إيقاف الصوت
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => speakText(response)}
                  className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-sm"
                >
                  <Volume2 className="h-3.5 w-3.5" /> إعادة الاستماع صوتاً 🔊
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notice alert if mic issue occurs */}
        {micNotice && (
          <div className="mt-3 w-full rounded-2xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2 text-center justify-center">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{micNotice}</span>
          </div>
        )}

        {/* Mic Button */}
        <div className="relative mt-8 flex flex-col items-center justify-center">
          {listening && (
            <>
              <span className="pulse-ring absolute h-36 w-36 rounded-full bg-destructive/30 animate-ping" />
              <span className="pulse-ring absolute h-32 w-32 rounded-full bg-destructive/20" />
            </>
          )}

          <button
            type="button"
            onClick={listening ? stopSpeaking : startListening}
            className={cn(
              "relative z-10 flex h-28 w-28 items-center justify-center rounded-full shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
              listening
                ? "bg-destructive text-destructive-foreground shadow-destructive/40 ring-4 ring-destructive/30"
                : "surface-brand text-primary-foreground hover:shadow-primary/40",
            )}
            aria-label={listening ? "إيقاف الاستماع" : "ابدأ التحدث"}
          >
            {listening ? <Square className="h-9 w-9" /> : <Mic className="h-10 w-10 text-white" />}
          </button>

          <p className="mt-4 text-xs font-bold text-muted-foreground">
            {listening ? "🎙️ ينصت إليك الآن... تحدث بسؤالك" : "اضغط على الميكروفون للتحدث صوتاً مع الراوي"}
          </p>
        </div>

        {/* Text Input Form (Fully Enabled & Interactive) */}
        <form onSubmit={handleTextSubmit} className="mt-8 w-full flex items-center gap-2 relative z-20">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="أو اكتب سؤالك هنا واسأل الراوي..."
            className="flex-1 rounded-full border border-border bg-card px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md"
            aria-label="إرسال السؤال"
          >
            <Send className="h-5 w-5 rtl:rotate-180" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="mt-6 w-full">
          <p className="mb-3 flex items-center justify-end gap-2 text-sm font-bold text-foreground">
            أسئلة سريعة للراوي <Sparkles className="h-4 w-4 text-primary" />
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {chatSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  playClickSound();
                  askAI(s);
                }}
                className="rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Switch to Chat link */}
        <Link
          to="/chat"
          className="mt-6 w-full rounded-full border border-border bg-card py-3.5 text-center text-sm font-bold text-foreground hover:bg-secondary transition-colors"
        >
          التبديل إلى المحادثة النصية الكلاسيكية 💬
        </Link>
      </div>
    </AppShell>
  );
}
