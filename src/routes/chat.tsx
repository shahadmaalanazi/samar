import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { chatSuggestions, seedChat, places } from "@/lib/data";
import { cn } from "@/lib/utils";
import { playClickSound } from "@/lib/sound-fx";
import { getSamarSocialReply } from "@/lib/samar-social-rules";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "محادثة راوي المكان — سمر" },
      { name: "description", content: "اسأل راوي المكان كتابةً عن أي موقع تراثي سعودي واحصل على قصته." },
      { property: "og:title", content: "محادثة راوي المكان — سمر" },
      { property: "og:description", content: "محادثة ذكية عن التراث السعودي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; text: string };

function generateHeritageAnswer(query: string): string {
  const q = query.trim().toLowerCase();

  // 1. أين تقع / الموقع الجغرافي
  if (q.includes("اين") || q.includes("أين") || q.includes("وين") || q.includes("موقع") || q.includes("تقع")) {
    if (q.includes("علا")) {
      return "تقع محافظة العلا في شمال غرب المملكة العربية السعودية، ضمن منطقة المدينة المنورة، وتبعد حوالي 300 كم شمال مدينة المدينة المنورة.";
    }
    if (q.includes("درعية") || q.includes("طريف")) {
      return "تقع الدرعية التاريخية وحي الطريف في شمال غرب مدينة الرياض على ضفاف وادي حنيفة الخصب، وهي عاصمة الدولة السعودية الأولى.";
    }
    if (q.includes("مصمك")) {
      return "يقع قصر المصمك في حي الديرة بقلب مدينة الرياض، وتحديداً بالقرب من ساحة الصفاة وقصر الحكم.";
    }
    if (q.includes("جدة") || q.includes("بلد")) {
      return "تقع جدة التاريخية (حي البلد) في قلب مدينة جدة بالمنطقة الغربية على ساحل البحر الأحمر.";
    }
    if (q.includes("أحساء") || q.includes("احساء") || q.includes("قارة")) {
      return "تقع واحة الأحساء في شرق المملكة العربية السعودية بالمنطقة الشرقية، وتعتبر أكبر واحة نخيل مستقلة في العالم.";
    }
    if (q.includes("تاروت") || q.includes("شرقية")) {
      return "تقع جزيرة وقلعة تاروت في خليج تاروت قبالة مدينة القطيف بالمنطقة الشرقية على الخليج العربي.";
    }
  }

  // 2. الأسئلة عن العلا والدرعية والمصمك وجدة والأحساء
  if (q.includes("علا") || q.includes("أنباط") || q.includes("حجر") || q.includes("صالح")) {
    return "العلا هي تحفة تراثية عالمية تضم موقع 'الحِجر' (مدائن صالح) المسجل في اليونسكو، وتشتهر بمقابر الأنباط الصخرية وقصر الفريد وجبل الفيل.";
  }
  if (q.includes("مصمك") || q.includes("بنى")) {
    return "بُني قصر المصمك عام 1895م في عهد الإمام عبد الله بن فيصل بن تركي آل سعود، وشهد فتح الرياض وتوحيد المملكة على يد الملك عبد العزيز عام 1902م.";
  }
  if (q.includes("درعية") || q.includes("طريف") || q.includes("سلوى")) {
    return "الدرعية وحي الطريف المسجل في اليونسكو يمثلان مهد الدولة السعودية الأولى، وتضم قصر سلوى والمباني النجدية الطينية التاريخية المطلة على وادي حنيفة.";
  }
  if (q.includes("جدة") || q.includes("بلد") || q.includes("روشان") || q.includes("رواشين")) {
    return "جدة التاريخية (البلد) تمتاز برواشينها الخشبية الجذابة ومبانيها المرجانية العريقة، وكانت البوابة الرئيسية لحجاج بيت الله الحرام عبر البحر الأحمر لقرون طويلة.";
  }
  if (q.includes("أحساء") || q.includes("نخيل") || q.includes("قارة") || q.includes("واحة")) {
    return "واحة الأحساء هي أكبر واحة نخيل مستقلة في العالم بـ 2.5 مليون نخلة ومسجلة لدى اليونسكو، وتضم جبل القارة وعيون الماء الدافئة وقصر إبراهيم التراثي.";
  }
  if (q.includes("وقت") || q.includes("متى") || q.includes("موسم") || q.includes("زيارة")) {
    return "أفضل وقت لزيارة المعالم التراثية في المملكة هو خلال فصلي الشتاء والخريف (من أكتوبر إلى مارس)، للاستمتاع بالأجواء الصحراوية المعتدلة والفعاليات الثقافية.";
  }
  if (q.includes("أكل") || q.includes("مطعم") || q.includes("شعبية") || q.includes("طعام")) {
    return "المأكولات الشعبية والتراثية السعودية مثل الكبسة، الجريش، القرصان، والحنيني تعكس كرم الضيافة وتنوع الثقافة الغذائية عبر مناطق المملكة.";
  }
  if (q.includes("كم") || q.includes("عدد") || q.includes("يونسكو") || q.includes("مواقع")) {
    return "تضم المملكة العربية السعودية العديد من المواقع التراثية المسجلة رسمياً في قائمة اليونسكو للتراث العالمي، منها: الحِجر بالعلا، حي الطريف بالدرعية، جدة التاريخية، واحة الأحساء، والفنون الصخرية بحائل.";
  }

  const matchedPlace = places.find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.region.toLowerCase()));
  if (matchedPlace) {
    return `${matchedPlace.name} (${matchedPlace.tagline}): ${matchedPlace.description}`;
  }

  return `سؤالك عن "${query}" موضوع تراثي عريق! التراث السعودي مليء بالقصص والمعالم المجيدة التابعة لهيئة التراث بوزارة الثقافة.`;
}

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(seedChat);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || loading) return;
    try {
      playClickSound();
    } catch {}

    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");
    setLoading(true);

    let replyText = "";

    try {
      // 1. Check fixed social rules first
      const fixedReply = getSamarSocialReply(value);
      if (fixedReply) {
        replyText = fixedReply;
      } else {
        // 2. Fetch from Gemini API with 12-second timeout
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 12000);

          const res = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: value, site: "التراث السعودي" }),
            signal: controller.signal,
          });

          clearTimeout(tid);

          if (res.ok) {
            const data = await res.json();
            if (data.answer) replyText = data.answer;
          }
        } catch (err) {
          console.warn("API ask timeout or fail, using smart heritage reply:", err);
        }

        // 3. Fallback to smart heritage answer engine if API fails or times out
        if (!replyText) {
          replyText = generateHeritageAnswer(value);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      replyText = generateHeritageAnswer(value);
    } finally {
      setLoading(false);
    }

    if (replyText) {
      setMessages((m) => [...m, { role: "assistant", text: replyText }]);
      speak(replyText);
    }
  };

  return (
    <AppShell className="pb-24">
      <PageHeader title="راوي المكان" subtitle="محادثة نصية مباشرة مع راوي سمر" />

      <div className="flex flex-col min-h-[calc(100vh-180px)] max-w-4xl mx-auto w-full px-4 sm:px-6">
        {/* Messages List Container */}
        <div className="flex-1 space-y-4 py-4 overflow-y-auto min-h-[360px]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "page-enter max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-sm leading-relaxed shadow-md transition-all",
                m.role === "user"
                  ? "ms-auto rounded-3xl rounded-ee-xs surface-brand text-primary-foreground font-medium"
                  : "me-auto rounded-3xl rounded-es-xs border border-border bg-card text-foreground",
              )}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="me-auto rounded-3xl rounded-es-xs border border-border bg-card px-5 py-3 text-xs text-muted-foreground animate-pulse flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              الراوي يستحضر القصة والتاريخ…
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="py-2">
          <p className="text-xs font-bold text-muted-foreground mb-2 text-end">مقترحات الأسئلة:</p>
          <div className="hide-scrollbar flex flex-wrap justify-end gap-2">
            {chatSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-all cursor-pointer shadow-sm hover:shadow"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-3 flex items-center gap-2 relative z-20"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل الراوي أي سؤال عن المعالم التراثية…"
            className="flex-1 rounded-full border border-border bg-card px-5 py-3.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="إرسال"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full surface-brand text-primary-foreground shadow-glow disabled:opacity-40 transition-transform active:scale-95 cursor-pointer"
          >
            <Send className="h-5 w-5 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
