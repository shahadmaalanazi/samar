import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/chrome";
import { PlaceCard } from "@/components/place-card";
import { places } from "@/lib/data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "المفضلة — سمر" },
      { name: "description", content: "المواقع التراثية التي حفظتها لزيارتها والاستماع لقصصها لاحقاً." },
      { property: "og:title", content: "المفضلة — سمر" },
      { property: "og:description", content: "قائمة مواقعك التراثية المحفوظة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useAppState();
  const list = places.filter((p) => favorites.includes(p.id));

  return (
    <AppShell>
      <PageHeader title="المفضلة" subtitle={`${list.length} موقع محفوظ`} />
      <div className="space-y-4 px-5">
        {list.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
        {list.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">لا توجد مواقع محفوظة بعد.</p>
            <Link
              to="/explore"
              className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
            >
              اكتشف المواقع
            </Link>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
