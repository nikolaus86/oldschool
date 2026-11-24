"use client";

import { useState } from "react";
import type { MagazineParams, ColorPalette, Mood } from "@/types/magazine";

interface Props {
  initialParams: MagazineParams;
  onGenerate: (params: MagazineParams) => void;
  loading: boolean;
}

const COLOR_OPTIONS: { value: ColorPalette; label: string; color: string }[] = [
  { value: "pink", label: "Розовый", color: "#ff007f" },
  { value: "cyan", label: "Голубой", color: "#00ffff" },
  { value: "purple", label: "Фиолет", color: "#9d4edd" },
  { value: "lime", label: "Лайм", color: "#7cfc00" },
  { value: "orange", label: "Оранж", color: "#ff6b00" },
];

const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: "glamour", label: "Гламур" },
  { value: "grunge", label: "Гранж" },
  { value: "futuristic", label: "Футуризм" },
  { value: "nostalgic", label: "Ностальгия" },
  { value: "edgy", label: "Дерзость" },
];

export default function MagazineForm({
  initialParams,
  onGenerate,
  loading,
}: Props) {
  const [params, setParams] = useState<MagazineParams>(initialParams);

  const update = <K extends keyof MagazineParams>(
    key: K,
    value: MagazineParams[K]
  ) => setParams((prev) => ({ ...prev, [key]: value }));

  const updateCoverLine = (index: number, value: string) => {
    const lines = [...params.coverLines];
    lines[index] = value;
    update("coverLines", lines);
  };

  const addCoverLine = () =>
    update("coverLines", [...params.coverLines, ""]);

  const removeCoverLine = (index: number) =>
    update("coverLines", params.coverLines.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-inter text-black">
      <h2 className="text-2xl font-montserrat italic font-black uppercase mb-4">Кто попадет на обложку?</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase mb-1">Имя журнала</label>
          <input
            type="text"
            value={params.magazineName}
            onChange={(e) => update("magazineName", e.target.value)}
            maxLength={14}
            className="w-full px-3 py-2 bg-transparent border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink transition"
            placeholder="Например, MEGA"
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

      <div>
        <label className="block text-xs font-bold uppercase mb-1">Тема номера</label>
        <input
          type="text"
          value={params.theme}
          onChange={(e) => update("theme", e.target.value)}
          maxLength={22}
          className="w-full px-3 py-2 bg-transparent border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink transition"
          placeholder="Y2K REVIVAL"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase mb-1">Подзаголовок</label>
        <input
          type="text"
          value={params.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          maxLength={80}
          className="w-full px-3 py-2 bg-transparent border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink transition"
          placeholder="Возвращение нулевых"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase mb-1">Описание модели (промпт для AI)</label>
        <textarea
          value={params.imagePrompt}
          onChange={(e) => update("imagePrompt", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-transparent border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink transition resize-none"
          placeholder="Модель с серебристыми украшениями, глянцевая студия..."
        />
        <div className="mt-2 bg-kiosk-cyan text-black text-sm px-4 py-2 border border-black">
          Подсказка: чем конкретнее опишешь, тем круче получится. Мы всё равно всех перерисуем!
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase mb-1">Цветовая гамма</label>
        <div className="flex gap-2 flex-wrap mt-2">
          {COLOR_OPTIONS.map((opt) => {
            const active = params.colorPalette === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("colorPalette", opt.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border-2 text-xs font-bold transition ${
                  active
                    ? "border-black bg-white"
                    : "border-transparent bg-white/50 hover:bg-white/80"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black"
                  style={{ backgroundColor: opt.color }}
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase mb-1">Настроение</label>
        <div className="flex gap-2 flex-wrap mt-2">
          {MOOD_OPTIONS.map((opt) => {
            const active = params.mood === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("mood", opt.value)}
                className={`px-3 py-1.5 rounded-full border-2 border-black text-xs font-bold transition ${
                  active
                    ? "bg-kiosk-pink text-white"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold uppercase">Заголовки на обложке</label>
          <span className="text-[10px] text-gray-500">{params.coverLines.length} шт.</span>
        </div>
        <div className="space-y-2">
          {params.coverLines.map((line, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={line}
                onChange={(e) => updateCoverLine(i, e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink transition"
                placeholder={`Заголовок #${i + 1}`}
                maxLength={48}
              />
              <button
                type="button"
                onClick={() => removeCoverLine(i)}
                className="px-3 text-gray-500 hover:text-red-500 transition font-bold"
                aria-label="Удалить"
              >
                ✕
              </button>
            </div>
          ))}
          {params.coverLines.length < 6 && (
            <button
              type="button"
              onClick={addCoverLine}
              className="w-full py-2 border-2 border-dashed border-gray-400 rounded text-xs font-bold text-gray-500 hover:border-kiosk-pink hover:text-kiosk-pink transition"
            >
              + Добавить заголовок
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t-2 border-dashed border-gray-300">
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