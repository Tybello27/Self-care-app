import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Quicksand, Playfair_Display } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quick",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-play",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Treat Yourself — Self-Care Planner",
  description:
    "A calm, beautiful self-care planner and mood tracker. Schedule rituals, track your mood, and discover what lifts you.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Treat Yourself",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#efe7fb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${playfair.variable}`}>
      <body className="font-sans text-[#4a3f55] antialiased">{children}</body>
    </html>
  );
}
