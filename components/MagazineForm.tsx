"use client";

import { useState } from "react";
import type { MagazineParams, ColorPalette, Mood } from "@/types/magazine";

// ... (оставляем константы COLOR_OPTIONS и MOOD_OPTIONS без изменений) ...

export default function MagazineForm({ initialParams, onGenerate, loading }: Props) {
  const [params, setParams] = useState<MagazineParams>(initialParams);

  // ... (функции update, updateCoverLine, addCoverLine, removeCoverLine без изменений) ...

  return (
    <form onSubmit={(e) => { e.preventDefault(); onGenerate(params); }} className="space-y-6 font-inter text-black">
      <h2 className="text-2xl font-montserrat italic font-black uppercase mb-4">Кто попадет на обложку?</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase mb-1">Имя героя</label>
          <input
            type="text"
            value={params.magazineName}
            onChange={(e) => update("magazineName", e.target.value)}
            className="w-full px-3 py-2 bg-transparent border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink transition"
            placeholder="Например, Саша"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-1">Выпуск</label>
          <input
            type="text"
            value={params.issue}
            onChange={(e) => update("issue", e.target.value)}
            className="w-full px-3 py-2 bg-transparent border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink transition"
            placeholder="№ 08 · 2026"
          />
        </div>
      </div>

      {/* ... Другие поля аналогично (textarea, выбор цветов) ... */}
      
      <div>
        <label className="block text-xs font-bold uppercase mb-1">Описание модели (промпт для AI)</label>
        <textarea
          value={params.imagePrompt}
          onChange={(e) => update("imagePrompt", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-transparent border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink transition resize-none"
        />
        <div className="mt-2 bg-kiosk-cyan text-black text-sm px-4 py-2 border border-black">
          Подсказка: чем конкретнее опишешь, тем круче получится. Мы всё равно всех перерисуем!
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-300">
        <span className="text-xs font-bold text-gray-500">ОСТАЛОСЬ 4 ШАГА</span>
        <button
          type="submit"
          disabled={loading}
          className="bg-kiosk-pink text-white font-black text-lg px-8 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all disabled:opacity-50"
        >
          {loading ? "ГЕНЕРАЦИЯ..." : "ДАЛЬШЕ →"}
        </button>
      </div>
    </form>
  );
}