"use client";

import { useState } from "react";
import type { MagazineParams, ColorPalette, Mood } from "@/types/magazine";

interface Props {
  initialParams: MagazineParams;
  onGenerate: (params: MagazineParams) => void;
  loading: boolean;
}

const COLOR_OPTIONS: { value: ColorPalette; label: string; color: string }[] = [
  { value: "pink", label: "Розовый", color: "#FF1493" },
  { value: "cyan", label: "Голубой", color: "#00BFFF" },
  { value: "purple", label: "Фиолет", color: "#9D4EDD" },
  { value: "lime", label: "Лайм", color: "#7CFC00" },
  { value: "orange", label: "Оранж", color: "#FF6B00" },
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Название + выпуск */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Название журнала">
          <input
            type="text"
            value={params.magazineName}
            onChange={(e) => update("magazineName", e.target.value)}
            maxLength={14}
            className={inputCls}
            placeholder="MEGA"
          />
        </Field>
        <Field label="Выпуск">
          <input
            type="text"
            value={params.issue}
            onChange={(e) => update("issue", e.target.value)}
            className={inputCls}
            placeholder="№ 08 · 2026"
          />
        </Field>
      </div>

      {/* Тема */}
      <Field label="Тема номера">
        <input
          type="text"
          value={params.theme}
          onChange={(e) => update("theme", e.target.value)}
          maxLength={22}
          className={inputCls}
          placeholder="Y2K REVIVAL"
        />
      </Field>

      <Field label="Подзаголовок">
        <input
          type="text"
          value={params.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          maxLength={80}
          className={inputCls}
          placeholder="Возвращение нулевых"
        />
      </Field>

      {/* Промпт для модели */}
      <Field
        label="Описание модели (промпт для AI)"
        hint="Кто на обложке, что делает, в чём одет"
      >
        <textarea
          value={params.imagePrompt}
          onChange={(e) => update("imagePrompt", e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
          placeholder="Модель с серебристыми украшениями, глянцевая студия, лёгкая аэрография..."
        />
      </Field>

      {/* Цвет */}
      <Field label="Цветовая гамма">
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map((opt) => {
            const active = params.colorPalette === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("colorPalette", opt.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-semibold transition ${
                  active
                    ? "border-white bg-white/10"
                    : "border-white/15 bg-transparent hover:bg-white/5"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: opt.color }}
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Настроение */}
      <Field label="Настроение">
        <div className="flex gap-2 flex-wrap">
          {MOOD_OPTIONS.map((opt) => {
            const active = params.mood === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("mood", opt.value)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                  active
                    ? "border-pink-400 bg-pink-400/10 text-pink-200"
                    : "border-white/15 hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Cover lines */}
      <Field
        label="Заголовки на обложке"
        hint={`${params.coverLines.length} шт. — выводим поверх фото`}
      >
        <div className="space-y-2">
          {params.coverLines.map((line, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={line}
                onChange={(e) => updateCoverLine(i, e.target.value)}
                className={inputCls}
                placeholder={`Заголовок #${i + 1}`}
                maxLength={48}
              />
              <button
                type="button"
                onClick={() => removeCoverLine(i)}
                className="px-3 text-white/40 hover:text-red-400 transition"
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
              className="w-full py-2 border border-dashed border-white/20 rounded-md text-xs text-white/50 hover:border-white/40 hover:text-white transition"
            >
              + Добавить заголовок
            </button>
          )}
        </div>
      </Field>

      {/* Кнопка */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-md font-bold tracking-wider uppercase text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: loading
            ? "#333"
            : "linear-gradient(90deg, #ff1493, #9d4edd)",
          color: "#fff",
        }}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Генерация...
          </span>
        ) : (
          "⚡ Сгенерировать обложку"
        )}
      </button>
    </form>
  );
}

const inputCls =
  "w-full px-3 py-2 bg-white/5 border border-white/15 rounded-md text-sm text-white placeholder-white/30 focus:outline-none focus:border-pink-400/60 focus:bg-white/[0.07] transition";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-white/70">
          {label}
        </label>
        {hint && <span className="text-[10px] text-white/40">{hint}</span>}
      </div>
      {children}
    </div>
  );
}