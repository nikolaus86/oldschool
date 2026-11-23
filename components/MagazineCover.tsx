"use client";

import type { MagazineParams } from "@/types/magazine";

interface Props {
  params: MagazineParams;
  imageUrl?: string;
}

const PALETTES: Record<
  MagazineParams["colorPalette"],
  { primary: string; secondary: string; dark: string; text: string }
> = {
  pink:   { primary: "#FF1493", secondary: "#FF69B4", dark: "#1a0a14", text: "#FFFFFF" },
  cyan:   { primary: "#00BFFF", secondary: "#00CED1", dark: "#0a1a1f", text: "#001F3F" },
  purple: { primary: "#9D4EDD", secondary: "#C77DFF", dark: "#140a1f", text: "#FFFFFF" },
  lime:   { primary: "#7CFC00", secondary: "#32CD32", dark: "#0a1f0a", text: "#0a1f0a" },
  orange: { primary: "#FF6B00", secondary: "#FFA500", dark: "#1a0f00", text: "#1a0f00" },
};

export default function MagazineCover({ params, imageUrl }: Props) {
  const p = PALETTES[params.colorPalette];

  return (
    <div
      id="magazine-cover"
      className="relative w-full aspect-[3/4] overflow-hidden shadow-2xl border border-white/20"
      style={{ backgroundColor: p.dark }}
    >
      {/* Фон */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : `linear-gradient(135deg, ${p.primary}, ${p.secondary})`,
        }}
      />

      {/* Затемнение для читаемости */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Глянцевый блик */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
        }}
      />

      {/* Плейсхолдер, если картинки ещё нет */}
      {!imageUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-10 text-center">
          <div className="max-w-xs">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-white/80 text-sm leading-relaxed">
              Нажмите <b>«Сгенерировать»</b> — здесь появится модель на обложке
            </p>
          </div>
        </div>
      )}

      {/* Контент */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Верхняя плашка: название + выпуск */}
        <div className="flex items-start justify-between p-4 pt-5">
          <h1
            className="font-anton text-6xl md:text-7xl leading-none tracking-tighter"
            style={{
              color: "#fff",
              WebkitTextStroke: "1.5px #000",
              textShadow: `3px 3px 0 ${p.primary}, 5px 5px 0 #000, 0 0 30px ${p.primary}`,
            }}
          >
            {params.magazineName || "MEGA"}
          </h1>
          <div className="text-right text-white space-y-1 shrink-0">
            <div className="text-xs font-bold tracking-widest">
              {params.issue || "№ 01 · 2026"}
            </div>
            <div className="text-xs font-bold">₽ 299</div>
            <div className="text-[10px] font-mono opacity-70">12+</div>
          </div>
        </div>

        {/* Cover lines */}
        <div className="px-3 mt-2 space-y-2 max-w-[62%]">
          {params.coverLines.filter(Boolean).map((line, i) => (
            <div
              key={i}
              className="bg-white/95 text-black px-2.5 py-1.5 text-[13px] md:text-sm font-black uppercase leading-tight shadow-md"
              style={{
                fontFamily: "var(--font-oswald)",
                transform: `rotate(${i % 2 === 0 ? -1.5 : 1}deg)`,
                borderLeft: `5px solid ${p.primary}`,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* Тема номера */}
        <div className="px-4 pb-4 text-center">
          <div
            className="inline-block px-3 py-1 text-white text-[11px] font-bold uppercase tracking-widest mb-2"
            style={{ backgroundColor: p.primary }}
          >
            Тема номера
          </div>
          <h2
            className="font-anton text-4xl md:text-5xl uppercase text-white leading-none"
            style={{
              textShadow: "2px 2px 0 #000, 0 0 24px rgba(0,0,0,0.6)",
            }}
          >
            {params.theme || "ЗАГОЛОВОК"}
          </h2>
          <p className="text-white/90 text-sm mt-2 font-medium drop-shadow">
            {params.subtitle}
          </p>
        </div>

        {/* Нижняя плашка */}
        <div className="bg-black text-white px-3 py-2 flex items-center justify-between text-[10px]">
          <div className="flex gap-3 overflow-hidden">
            <span className="whitespace-nowrap">★ МОДА</span>
            <span className="whitespace-nowrap">★ КРАСОТА</span>
            <span className="whitespace-nowrap">★ МУЗЫКА</span>
            <span className="whitespace-nowrap">★ СТИЛЬ</span>
          </div>
          <div className="font-mono tracking-tighter opacity-80">
            ||| || |||| | |||
          </div>
        </div>
      </div>
    </div>
  );
}