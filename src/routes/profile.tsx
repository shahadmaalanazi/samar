import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Heart, Settings, ChevronLeft, Edit2, Check, User } from "lucide-react";
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
  const {
    userName,
    setUserName,
    userPoints,
    userTrips,
    userStories,
    completedChallenges,
    earnedBadges,
    favorites,
  } = useAppState();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const initialLetter = (userName.trim().charAt(0) || "م").toUpperCase();

  const getLevelName = (pts: number) => {
    if (pts < 300) return "مستكشف جديد";
    if (pts < 1000) return "مستكشف خبير";
    return "راوي التراث";
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <AppShell>
      <PageHeader title="ملفي" actions={<ThemeToggle />} />

      <div className="flex flex-col items-center px-5">
        {/* Avatar Circle with Dynamic First Letter */}
        <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent bg-secondary text-3xl font-extrabold text-primary shadow-sm">
          {initialLetter}
        </span>

        {/* Editable Name Section */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                placeholder="اكتب اسمك هنا…"
                className="rounded-xl border border-primary bg-card px-3 py-1.5 text-center text-base font-bold text-foreground outline-none shadow-sm focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveName}
                aria-label="حفظ الاسم"
                className="flex h-8 w-8 items-center justify-center rounded-full surface-brand text-primary-foreground shadow-sm cursor-pointer"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-foreground">{userName}</p>
              <button
                type="button"
                onClick={() => {
                  setTempName(userName);
                  setIsEditing(true);
                }}
                aria-label="تعديل الاسم"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <p className="mt-0.5 text-xs font-semibold text-primary/90">{getLevelName(userPoints)}</p>
      </div>

      <div className="max-w-xl mx-auto w-full">
        {/* User Stats Grid (Trips, Stories, Challenges) */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse rounded-2xl border border-border bg-card px-5 py-4 shadow-card mx-5">
          <Stat value={String(userTrips)} label="الرحلات" />
          <Stat value={String(userStories)} label="القصص" />
          <Stat value={String(completedChallenges.length)} label="التحديات" />
        </div>

        {/* Level & Points Progress Bar */}
        <div className="mx-5 mt-4 rounded-2xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">مستواك الحالي</p>
          <p className="text-sm font-bold text-foreground">{getLevelName(userPoints)}</p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${Math.min(100, (userPoints / 2100) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-end text-[11px] font-bold text-muted-foreground">
            {userPoints} / 2100 نقطة
          </p>
        </div>

        {/* Navigation Rows */}
        <ul className="mx-5 mt-5 space-y-3 pb-8">
          <Row
            to="/achievements"
            icon={<Award className="h-4.5 w-4.5" />}
            label="إنجازاتي"
            hint={`${earnedBadges.length} شارة`}
          />
          <Row
            to="/favorites"
            icon={<Heart className="h-4.5 w-4.5" />}
            label="المفضلة"
            hint={`${favorites.length} موقع`}
          />
          <Row to="/settings" icon={<Settings className="h-4.5 w-4.5" />} label="الإعدادات" hint="" />
        </ul>
      </div>
    </AppShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-extrabold text-foreground">{value}</p>
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
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
        className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/50 transition-colors"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          {icon}
        </span>
        <span className="truncate text-sm font-semibold text-foreground">{label}</span>
        <span className="shrink-0 text-xs font-bold text-muted-foreground">{hint}</span>
        <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground ltr:rotate-180" />
      </Link>
    </li>
  );
}
