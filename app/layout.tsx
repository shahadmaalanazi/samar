import "./globals.css";
import { Cairo } from "next/font/google";
import type { Metadata } from "next";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "سمر — حيث تحكي الأماكن قصصها",
  description: "تطبيق سمر للتراث السعودي: قصص صوتية، راوي ذكي، وتحديات تفاعلية في أجمل المواقع التراثية.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body style={{ fontFamily: "var(--font-cairo), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
