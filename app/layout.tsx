import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const display = Urbanist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Random Generator — Design by Rahadianm22",
  description:
    "Draws a practice design brief and writes the matching brief for it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={display.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
