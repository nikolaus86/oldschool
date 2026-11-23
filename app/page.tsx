"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MagazineForm from "@/components/MagazineForm";
import { DEFAULT_PARAMS, STORAGE_KEY } from "@/types/magazine";
import type { MagazineParams } from "@/types/magazine";

export default function Home() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleGenerate = (params: MagazineParams) => {
    setNavigating(true);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    router.push("/result");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Фоновые светящиеся пятна */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, #ff1493, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, #9d4edd, transparent 70%)" }}
      />

      {/* Сетка */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Левая часть — хиро */}
          <div className="lg:sticky lg:top-10">
            <div className="inline-block px-3 py-1 mb-6 border border-pink-400/40 text-pink-300 text-[10px] font-bold tracking-[0.3em] uppercase">
              ● Y2K Magazine Generator
            </div>

            <h1 className="font-anton text-[52px] md:text-7xl lg:text-[92px] leading-[0.85] tracking-tighter mb-6">
              СОЗДАЙ
              <br />
              <span
                className="text-pink-500"
                style={{
                  textShadow:
                    "0 0 30px rgba(255,20,147,0.6), 3px 3px 0 #000",
                }}
              >
                СВОЙ
              </span>
              <br />
              ЖУРНАЛ
            </h1>

            <p className="text-white/60 text-base md:text-lg max-w-md mb-8 leading-relaxed">
              Заполни форму — и получи глянцевую обложку в эстетике нулевых.
              ИИ сгенерирует фото модели, а ты выберешь настроение, цвет и
              заголовки.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {[
                "★ Глянцевый Y2K",
                "★ AI-модель",
                "★ Скачать PNG",
                "★ Бесплатно",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Мини-подсказка */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-white/40">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              Генерация занимает 5–15 секунд
            </div>
          </div>

          {/* Правая часть — форма */}
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-pink-500/30 via-transparent to-purple-500/30 blur-sm opacity-60" />
            <div className="relative bg-neutral-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-7">
              <div className="mb-6">
                <h2 className="font-anton text-2xl md:text-3xl tracking-tight">
                  Собери обложку
                </h2>
                <p className="text-xs text-white/40 mt-1">
                  Все поля можно менять — превью появится на следующей странице
                </p>
              </div>

              <MagazineForm
                initialParams={DEFAULT_PARAMS}
                onGenerate={handleGenerate}
                loading={navigating}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}