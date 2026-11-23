import type { Metadata } from "next";
import { Anton, Oswald, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-anton",
});
const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  variable: "--font-oswald",
});
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Y2K Magazine Generator",
  description: "Генератор журналов в стиле нулевых",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${anton.variable} ${oswald.variable} ${inter.variable}`}
    >
      <body className="bg-neutral-950 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}