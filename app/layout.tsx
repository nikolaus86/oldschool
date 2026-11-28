import type { Metadata } from "next";
import { Montserrat, Inter, Neucha, Comfortaa, Rubik } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  weight: ["700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

// Дисплейный шрифт заголовков секций — жирный, с характером
const rubik = Rubik({
  weight: ["900"],
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-rubik",
});

// Округлый геометрический шрифт — вопросы в диалогах и подзаголовки
const comfortaa = Comfortaa({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-comfortaa",
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
    <html lang="ru" className={`${montserrat.variable} ${inter.variable} ${neucha.variable} ${comfortaa.variable} ${rubik.variable}`}>
      <body className="bg-[#1a0b2e] text-white font-inter antialiased min-h-screen selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}