import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, Settings, ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader, ThemeToggle } from "@/components/chrome";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "ملفي الشخصي — سمر" },
      { name: "description", content: "تابع رحلاتك وقصصك وتحدياتك ومستواك في اكتشاف التراث السعودي." },
      { property: "og:title", content: "ملفي الشخصي — سمر" },
      { property: "og:description", content: "رحلاتك وإنجازاتك في تطبيق سمر." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { favorites } = useAppState();

  return (
    <AppShell>
      <PageHeader title="ملفي" actions={<ThemeToggle />} />

      <div className="flex flex-col items-center px-5">
        <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent bg-secondary text-3xl font-bold text-primary">
          س
        </span>
        <p className="mt-3 text-lg font-bold text-foreground">سارة الحربي</p>
        <p className="text-xs text-muted-foreground">مستكشف</p>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse rounded-2xl border border-border bg-card px-5 py-4 shadow-card mx-5">
        <Stat value="12" label="الرحلات" />
        <Stat value="28" label="القصص" />
        <Stat value="15" label="التحديات" />
      </div>

      <div className="mx-5 mt-4 rounded-2xl border border-border bg-card p-4 shadow-card">
        <p className="text-xs text-muted-foreground">مستواك الحالي</p>
        <p className="text-sm font-bold text-foreground">مستكشف</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: "60%" }} />
        </div>
        <p className="mt-2 text-end text-[11px] text-muted-foreground">2100 / 3500</p>
      </div>

      <ul className="mx-5 mt-5 space-y-3">
        <Row to="/achievements" icon={<Award className="h-4.5 w-4.5" />} label="إنجازاتي" hint="12 شارة" />
        <Row
          to="/favorites"
          icon={<Heart className="h-4.5 w-4.5" />}
          label="المفضلة"
          hint={`${favorites.length} موقع`}
        />
        <Row to="/settings" icon={<Settings className="h-4.5 w-4.5" />} label="الإعدادات" hint="" />
      </ul>
    </AppShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({
  to,
  icon,
  label,
  hint,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          {icon}
        </span>
        <span className="truncate text-sm font-semibold text-foreground">{label}</span>
        <span className="shrink-0 text-xs text-muted-foreground">{hint}</span>
        <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground ltr:rotate-180" />
      </Link>
    </li>
  );
}
