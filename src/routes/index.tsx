import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "./onboarding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سمر — حيث تحكي الأماكن قصصها" },
      { name: "description", content: "تطبيق سمر للتراث السعودي" },
    ],
  }),
  component: Onboarding,
});
