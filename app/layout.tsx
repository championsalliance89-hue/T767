import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STNL Sports Analytics — Predictions",
  description: "Sahara Technologies Nigeria Limited. Daily Match Winner and Total Games predictions for Tennis and Table Tennis.",
  keywords: ["tennis predictions", "table tennis", "sports analytics", "STNL", "sahara technologies"],
  openGraph: {
    title: "STNL Sports Analytics",
    description: "Match Winner and Total Games O/U predictions — powered by Elo, form & H2H analysis.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080d18",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="relative z-10">{children}</body>
    </html>
  );
}
