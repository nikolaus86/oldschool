import type { Metadata } from "next";
import { Montserrat, Inter, Neucha, Alumni_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  weight: ["700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

// Дисплейный шрифт заголовков — узкий и жирный, как в референсах
const alumni = Alumni_Sans({
  weight: ["900"],
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-alumni",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const neucha = Neucha({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-neucha",
});

export const metadata: Metadata = {
  title: "КИОСК | Твой личный журнал",
  description: "Создай свой журнал в стиле нулевых",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${inter.variable} ${neucha.variable} ${alumni.variable}`}>
      <body className="bg-[#1a0b2e] text-white font-inter antialiased min-h-screen selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}