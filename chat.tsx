import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Mic } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { chatSuggestions, seedChat } from "@/lib/data";
import { cn } from "@/lib/utils";

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

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(seedChat);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "هذه إجابة تجريبية من راوي المكان. سيتم ربط الذكاء الاصطناعي لاحقاً ليروي لك القصة الكاملة عن هذا الموقع.",
        },
      ]);
    }, 700);
  };

  return (
    <AppShell>
      <PageHeader title="راوي المكان" subtitle="محادثة نصية" />

      <div className="space-y-3 px-5 pb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "page-enter max-w-[85%] px-4 py-3 text-sm leading-7 shadow-card",
              m.role === "user"
                ? "ms-auto rounded-3xl rounded-ee-md surface-brand text-primary-foreground"
                : "me-auto rounded-3xl rounded-es-md border border-border bg-card text-foreground",
            )}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
        {chatSuggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-background/90 px-5 py-3 backdrop-blur"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك…"
          className="flex-1 rounded-full border border-border bg-card px-4 py-3 text-sm outline-hidden placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="إرسال"
          className="surface-brand flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground shadow-soft transition-transform duration-300 active:scale-95"
        >
          <Send className="h-4.5 w-4.5 rtl:-scale-x-100" />
        </button>
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground">
          <Mic className="h-4.5 w-4.5" />
        </span>
      </form>
    </AppShell>
  );
}
