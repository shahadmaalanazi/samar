import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Globe, Bell, Volume2, Info, LogOut } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — سمر" },
      { name: "description", content: "تحكم في اللغة والوضع الليلي والإشعارات وتشغيل الصوت في تطبيق سمر." },
      { property: "og:title", content: "الإعدادات — سمر" },
      { property: "og:description", content: "خصص تجربتك في تطبيق سمر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors",
        on ? "bg-primary" : "bg-border",
      )}
    >
      <span
        className={cn(
          "block h-5 w-5 rounded-full bg-card shadow-card transition-transform",
          on ? "translate-x-0 rtl:-translate-x-5 ltr:translate-x-5" : "",
        )}
      />
    </button>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        {icon}
      </span>
      <span className="truncate text-sm font-semibold text-foreground">{label}</span>
      {children}
    </li>
  );
}

function SettingsPage() {
  const { theme, toggleTheme, lang, toggleLang } = useAppState();
  const [notif, setNotif] = useState(true);
  const [autoplay, setAutoplay] = useState(false);

  return (
    <AppShell>
      <PageHeader title="الإعدادات" actions={<span />} />
      <ul className="space-y-3 px-5">
        <Row icon={<Moon className="h-4.5 w-4.5" />} label="الوضع الليلي">
          <Toggle on={theme === "dark"} onClick={toggleTheme} />
        </Row>
        <Row icon={<Globe className="h-4.5 w-4.5" />} label="اللغة">
          <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">العربية</span>
        </Row>
        <Row icon={<Bell className="h-4.5 w-4.5" />} label="الإشعارات">
          <Toggle on={notif} onClick={() => setNotif((v) => !v)} />
        </Row>
        <Row icon={<Volume2 className="h-4.5 w-4.5" />} label="تشغيل الصوت تلقائياً">
          <Toggle on={autoplay} onClick={() => setAutoplay((v) => !v)} />
        </Row>
        <Row icon={<Info className="h-4.5 w-4.5" />} label="عن التطبيق">
          <span className="shrink-0 text-xs text-muted-foreground">v1.0</span>
        </Row>
      </ul>

      <button
        type="button"
        className="mx-5 mt-6 flex w-[calc(100%-2.5rem)] items-center justify-center gap-2 rounded-full border border-destructive/40 py-3 text-sm font-bold text-destructive"
      >
        <LogOut className="h-4 w-4" />
        تسجيل الخروج
      </button>
    </AppShell>
  );
}
