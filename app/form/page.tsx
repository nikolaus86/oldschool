"use client";

import { useRouter } from "next/navigation";
import MagazineForm from "@/components/MagazineForm";
import { DEFAULT_PARAMS, STORAGE_KEY } from "@/types/magazine";
import type { MagazineParams } from "@/types/magazine";
import { useState } from "react";

export default function FormPage() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleGenerate = (params: MagazineParams) => {
    setNavigating(true);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    router.push("/result");
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-montserrat italic font-black text-outline uppercase mb-2">
          АНКЕТА БУДУЩЕГО НОМЕРА
        </h1>
        <p className="text-white/70 italic">Пять коротких шагов — и у редакции появляется весь материал</p>
      </div>

      {/* Лист бумаги */}
      <div className="w-full max-w-3xl bg-grid-paper text-black p-6 md:p-10 shadow-[10px_10px_0px_rgba(0,0,0,0.5)] relative border-4 border-gray-300">
        {/* Декоративный скотч сверху */}
        <div className="absolute -top-4 left-10 w-24 h-8 bg-cyan-400/80 rotate-[-5deg] shadow-sm z-10" />
        <div className="absolute -top-4 right-20 w-20 h-8 bg-yellow-400/80 rotate-[3deg] shadow-sm z-10" />

        <div className="mb-8 border-2 border-black rounded-full overflow-hidden h-6 relative bg-white">
          <div className="absolute top-0 left-0 h-full bg-kiosk-pink w-1/3" />
          <p className="absolute inset-0 text-center text-xs font-bold leading-5 z-10">ШАГ 1 ИЗ 5 — ГЕРОЙ</p>
        </div>

        {/* Передаем пропсы в вашу форму */}
        <MagazineForm
          initialParams={DEFAULT_PARAMS}
          onGenerate={handleGenerate}
          loading={navigating}
        />
      </div>
    </main>
  );
}