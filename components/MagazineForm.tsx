"use client";

import { useState } from "react";
import type { MagazineParams } from "@/types/magazine";

interface Props {
  initialParams: MagazineParams;
  onGenerate: (params: MagazineParams) => void;
  loading: boolean;
}

const TOTAL_STEPS = 5;

const STEP_NAMES = ["ГЕРОЙ", "ЛИЧНОСТЬ", "ПОРТРЕТ", "РАЗВЛЕЧЕНИЯ", "ФИНАЛ"];

const REMAINING = ["ОСТАЛОСЬ 4 ШАГА", "ОСТАЛОСЬ 3 ШАГА", "ОСТАЛОСЬ 2 ШАГА", "ОСТАЛСЯ 1 ШАГ"];

const CARTOON_UNIVERSES = [
  "Смешарики", "Винкс", "Барби", "Монстр Хай", "Принцессы Дисней",
  "Чародейки", "Hello Kitty", "My little pony", "Bratz", "Скубиду",
  "Тачки", "Черепашки ниндзя", "Феи (динь-динь)", "Трансформеры", "Hot Wheels",
  "Звездные войны", "Корпорация монстров", "KMM5+", "Кик Бутовски",
];

const SERIES_UNIVERSES = [
  "H2O", "Гарри Поттер", "Волшебники из Беверли-Хилс", "Ханна Монтана",
  "Как стать принцессой за 10 дней", "Ранетки", "Дрянные девчонки", "Отличница лёгкого поведения",
];

const RELATIONS = ["Подруга", "Друг", "Мама", "Папа", "Сестра", "Брат", "Любимый человек", "Коллега", "Одногруппник", "Другое"];

const GAMES = ["Раскраска", "Рисунок по точкам", "Кроссворд", "Филворд", "Найди отличия", "Лабиринт"];

const MAX_UNIVERSES = 3;
const MAX_PHOTOS = 4;

// Сжимаем фото перед отправкой: данные уходят в Supabase как base64
async function fileToCompressedDataUrl(
  file: File,
  maxSize = 1280,
  quality = 0.75
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = document.createElement("img");
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function MagazineForm({ initialParams, onGenerate, loading }: Props) {
  const [step, setStep] = useState(1);
  const [params, setParams] = useState<MagazineParams>({
    ...initialParams,
    universes: initialParams.universes || [],
    games: initialParams.games || [],
    extraPhotos: initialParams.extraPhotos || [],
    portraitPhotos: initialParams.portraitPhotos || [],
    memoryPhotos: initialParams.memoryPhotos || [],
  });

  const update = (key: keyof MagazineParams, value: any) =>
    setParams(prev => ({ ...prev, [key]: value }));

  const toggleArrayItem = (key: "universes" | "games", item: string) => {
    setParams(prev => {
      const arr = prev[key] || [];
      if (arr.includes(item)) return { ...prev, [key]: arr.filter(i => i !== item) };
      if (key === "universes" && arr.length >= MAX_UNIVERSES) return prev;
      return { ...prev, [key]: [...arr, item] };
    });
  };

  const addPhotos = async (
    key: "heroPhoto" | "extraPhotos" | "portraitPhotos" | "memoryPhotos",
    files: FileList | null
  ) => {
    if (!files || !files.length) return;

    // heroPhoto — строка, остальные — массивы
    if (key === "heroPhoto") {
      const compressed = await fileToCompressedDataUrl(files[0], 1600, 0.85);
      update("heroPhoto", compressed);
      return;
    }

    const compressed: string[] = [];
    for (const file of Array.from(files).slice(0, MAX_PHOTOS)) {
      compressed.push(await fileToCompressedDataUrl(file));
    }

    setParams(prev => {
      const arr = (prev[key] as string[]) || [];
      const free = Math.max(0, MAX_PHOTOS - arr.length);
      return { ...prev, [key]: [...arr, ...compressed.slice(0, free)] };
    });
  };

  const removePhoto = (key: "extraPhotos" | "portraitPhotos" | "memoryPhotos", index: number) => {
    setParams(prev => {
      const arr = (prev[key] as string[]) || [];
      return { ...prev, [key]: arr.filter((_, i) => i !== index) };
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < TOTAL_STEPS) {
      nextStep();
      return;
    }
    const universesStr = (params.universes || []).join(" and ") || "Y2K";
    const aiPrompt = `Character named ${params.heroName || "Hero"}, ${params.uniqueness || "cool"}, associated with ${universesStr}. style of ${params.favoriteCharacter || "fashion"}. aesthetic: ${params.favoriteColor || "pink"}.`;
    onGenerate({ ...params, imagePrompt: aiPrompt });
  };

  const PhotoGrid = ({
    photos, onAdd, onRemove, label = "+ Добавить фото",
  }: {
    photos: string[];
    onAdd: (files: FileList | null) => void;
    onRemove: (index: number) => void;
    label?: string;
  }) => (
    <div>
      <div className="flex flex-wrap gap-3">
        {photos.map((src, i) => (
          <div key={i} className="relative w-24 h-24">
            <img src={src} alt={`Фото ${i + 1}`} className="w-full h-full object-cover border-2 border-black shadow-md" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-kiosk-pink text-white rounded-full border-2 border-black text-xs font-black leading-none"
              aria-label="Удалить фото"
            >
              ×
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 text-center text-[10px] font-bold text-gray-600 bg-white/40 hover:bg-white/70 cursor-pointer transition">
            <span className="text-xl mb-0.5">📷</span>
            {label}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { onAdd(e.target.files); e.currentTarget.value = ""; }} />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-grid-paper text-black p-6 md:p-12 shadow-[12px_12px_0px_#000] border-2 border-gray-400 relative">
      {/* Скотч */}
      <div className="absolute -top-5 left-10 w-32 h-10 bg-[#00e5ff] rotate-[-4deg] shadow-sm z-10 opacity-90" />
      <div className="absolute -top-5 right-16 w-24 h-10 bg-[#ffe600] rotate-[5deg] shadow-sm z-10 opacity-90" />

      {/* АНИМИРОВАННЫЙ ПРОГРЕСС-БАР */}
      <div className="mb-10 mt-4">
        <div className="border-2 border-black rounded-full h-8 relative bg-white/90 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">

          {/* Заполненная часть, которая плавно растет */}
          <div
            className="absolute top-0 left-0 h-full transition-all duration-700 ease-out overflow-hidden rounded-r-full"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          >
            {/* Бегущие полоски */}
            <div className="absolute inset-0 progress-stripes" />

            {/* Пробегающий глянцевый блик */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="progress-shimmer absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>

            {/* Верхний объемный блик (стеклянный эффект) */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40 rounded-full" />
          </div>

          {/* Деления между шагами */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-0.5 bg-black/20 z-10"
              style={{ left: `${(i / TOTAL_STEPS) * 100}%` }}
            />
          ))}

          {/* Текст шага */}
          <p className="absolute inset-0 text-center text-[11px] md:text-sm font-black leading-7 z-20 uppercase text-black tracking-widest drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
            ШАГ {step} ИЗ {TOTAL_STEPS} — {STEP_NAMES[step - 1]}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 font-inter text-black">

        {/* ШАГ 1: ГЕРОЙ */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl md:text-3xl font-alumni italic font-black uppercase">
              Кто попадёт на обложку?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Имя героя</label>
                <input type="text" value={params.heroName || ""} onChange={(e) => update("heroName", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white" placeholder="Например, Саша" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">
                  Как к нему обращаешься <span className="normal-case text-gray-500 font-medium">(если хочешь)</span>
                </label>
                <input type="text" value={params.pseudonym || ""} onChange={(e) => update("pseudonym", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white" placeholder="Сашок, Сашуль, любимый..." />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Кто он тебе?</label>
                <select value={params.relation || ""} onChange={(e) => update("relation", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white">
                  <option value="">Выбери из списка</option>
                  {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Дата рождения</label>
                <input type="text" value={params.heroBirthdate || ""} onChange={(e) => update("heroBirthdate", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white" placeholder="12.05.2000" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase mb-1">Кто является посланником подарка?</label>
                <select value={params.giverType || "self"} onChange={(e) => update("giverType", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white">
                  <option value="self">Подарок от себя</option>
                  <option value="friends">Подарок от компании / друзей</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">
                В какой вселенной должен оказаться герой? <span className="normal-case text-gray-500 font-medium">(до {MAX_UNIVERSES})</span>
              </label>
              <div className="bg-white/30 border-2 border-dashed border-gray-300 rounded p-3 space-y-3 max-h-56 overflow-y-auto">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">Мультвселенные</p>
                  <div className="flex flex-wrap gap-2">
                    {CARTOON_UNIVERSES.map(u => (
                      <button type="button" key={u} onClick={() => toggleArrayItem("universes", u)} className={`px-3 py-1.5 text-xs border-2 border-black font-bold transition ${(params.universes || []).includes(u) ? "bg-kiosk-pink text-white" : "bg-white hover:bg-gray-100"}`}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">Сериалы</p>
                  <div className="flex flex-wrap gap-2">
                    {SERIES_UNIVERSES.map(u => (
                      <button type="button" key={u} onClick={() => toggleArrayItem("universes", u)} className={`px-3 py-1.5 text-xs border-2 border-black font-bold transition ${(params.universes || []).includes(u) ? "bg-kiosk-pink text-white" : "bg-white hover:bg-gray-100"}`}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Загрузи фото героя (для обложки)</label>
              <label className="block w-full border-2 border-dashed border-gray-400 p-6 text-center text-sm font-bold text-gray-700 bg-white/40 hover:bg-white/70 cursor-pointer transition">
                <span className="block text-2xl mb-2">📷</span>
                {params.heroPhoto ? "Изменить фото героя" : "+ Нажми, чтобы загрузить фотографию"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { addPhotos("heroPhoto", e.target.files); e.currentTarget.value = ""; }} />
              </label>
              {params.heroPhoto && <div className="mt-3 relative max-w-xs mx-auto"><img src={params.heroPhoto} alt="Фото героя" className="w-full max-h-72 object-cover border-2 border-black shadow-md" /><button type="button" onClick={() => update("heroPhoto", "")} className="mt-2 px-3 py-1 bg-kiosk-pink text-white border-2 border-black text-xs font-bold">Удалить фото</button></div>}
            </div>

            <div className="bg-kiosk-cyan/90 border-2 border-black rounded-md px-4 py-3 text-sm font-bold text-black">
              Подсказка: чем конкретнее ответы, тем смешнее получится номер. Мы всё равно всё перепроверим.
            </div>
          </div>
        )}

        {/* ШАГ 2: ЛИЧНОСТЬ */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl md:text-3xl font-alumni italic font-black uppercase">
              Личность — какой он на самом деле?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">В каком городе живёт?</label>
                <input type="text" value={params.city || ""} onChange={(e) => update("city", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Любимый персонаж или герой</label>
                <input type="text" value={params.favoriteCharacter || ""} onChange={(e) => update("favoriteCharacter", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Любимый цвет</label>
                <input type="text" value={params.favoriteColor || ""} onChange={(e) => update("favoriteColor", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Любимое животное или питомец</label>
                <input type="text" value={params.pet || ""} onChange={(e) => update("pet", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Что в нём есть такого, чего нет в других? <span className="normal-case text-gray-500 font-medium">(любая мелочь — его особенность)</span>
              </label>
              <textarea value={params.uniqueness || ""} onChange={(e) => update("uniqueness", e.target.value)} rows={2} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Какие 3–5 качеств лучше всего его описывают?</label>
              <input type="text" value={params.qualities || ""} onChange={(e) => update("qualities", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="весёлая, добрая, красивая" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">
                Любимые фото человека / детские фотографии <span className="normal-case text-gray-500 font-medium">(до {MAX_PHOTOS})</span>
              </label>
              <PhotoGrid photos={params.extraPhotos || []} onAdd={(files) => addPhotos("extraPhotos", files)} onRemove={(i) => removePhoto("extraPhotos", i)} label="+ Ещё фото" />
              <p className="text-xs text-gray-500 mt-2 italic">
                P.s. вспомни привычки, забавные особенности, любимые фразы и маленькие странности — всё то, что делает человека неповторимым.
              </p>
            </div>
          </div>
        )}

        {/* ШАГ 3: ПОРТРЕТ / ПИСЬМО */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl md:text-3xl font-alumni italic font-black uppercase">
              Портрет человека или тёплое послание
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Выбери один из вариантов наполнения</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => update("portraitType", "world")} className={`flex-1 p-3 border-2 border-black font-bold text-sm ${params.portraitType === "world" ? "bg-kiosk-cyan" : "bg-white"}`}>«Маленький мир героя»</button>
                <button type="button" onClick={() => update("portraitType", "letter")} className={`flex-1 p-3 border-2 border-black font-bold text-sm ${params.portraitType === "letter" ? "bg-kiosk-cyan" : "bg-white"}`}>«Письмо тебе»</button>
              </div>
            </div>

            {params.portraitType === "world" ? (
              <>
                <p className="text-sm font-bold">Расскажи о маленьких радостях, без которых сложно представить жизнь этого человека:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Любимая еда и/или напиток" value={params.favoriteFood || ""} onChange={(e) => update("favoriteFood", e.target.value)} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
                  <input type="text" placeholder="Любимое место: страна, город или локация" value={params.favoritePlace || ""} onChange={(e) => update("favoritePlace", e.target.value)} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
                  <input type="text" placeholder="Любимое время года" value={params.favoriteSeason || ""} onChange={(e) => update("favoriteSeason", e.target.value)} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
                  <input type="text" placeholder="Любимое хобби или занятие" value={params.favoriteHobby || ""} onChange={(e) => update("favoriteHobby", e.target.value)} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-bold">
                  Напиши те слова, которые давно хотел сказать этому человеку. Не пожелания, а личные слова в формате письма — за что ты ценишь человека и что хочешь сказать от всего сердца:
                </p>
                <textarea placeholder="Напиши слова, которые давно хотел сказать..." rows={4} value={params.personalLetter || ""} onChange={(e) => update("personalLetter", e.target.value)} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase mb-2">
                Прикрепляй больше фото! <span className="normal-case text-gray-500 font-medium">(до {MAX_PHOTOS})</span>
              </label>
              <PhotoGrid photos={params.portraitPhotos || []} onAdd={(files) => addPhotos("portraitPhotos", files)} onRemove={(i) => removePhoto("portraitPhotos", i)} label="+ Ещё фото" />
            </div>
          </div>
        )}

        {/* ШАГ 4: ТЕСТЫ, ИГРЫ, КОМИКС */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl md:text-3xl font-alumni italic font-black uppercase">
              Любимое занятие детства — тесты и игры!
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Какой тест делаем?</label>
              <div className="flex gap-4 mb-3">
                <button type="button" onClick={() => update("testType", "points")} className={`flex-1 p-3 border-2 border-black font-bold text-sm ${params.testType === "points" ? "bg-kiosk-yellow" : "bg-white"}`}>Тест с баллами</button>
                <button type="button" onClick={() => update("testType", "arrows")} className={`flex-1 p-3 border-2 border-black font-bold text-sm ${params.testType === "arrows" ? "bg-kiosk-yellow" : "bg-white"}`}>Тест «стрелочки»</button>
              </div>
              <input type="text" value={params.testTopic || ""} onChange={(e) => update("testTopic", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="Тема теста: персонаж, качество, профессия... (или оставь пустым — придумаем сами)" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Выбери игры (3–4 шт)</label>
              <div className="flex flex-wrap gap-2">
                {GAMES.map(g => (
                  <button type="button" key={g} onClick={() => toggleArrayItem("games", g)} className={`px-3 py-1.5 text-xs border-2 border-black font-bold transition ${(params.games || []).includes(g) ? "bg-kiosk-yellow" : "bg-white"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Связать игры с личными фактами?</label>
              <div className="flex gap-4 mb-3">
                <button type="button" onClick={() => update("gamePersonal", "yes")} className={`flex-1 p-3 border-2 border-black font-bold text-sm ${params.gamePersonal === "yes" ? "bg-kiosk-cyan" : "bg-white"}`}>Да, с личными деталями</button>
                <button type="button" onClick={() => update("gamePersonal", "no")} className={`flex-1 p-3 border-2 border-black font-bold text-sm ${params.gamePersonal === "no" ? "bg-kiosk-cyan" : "bg-white"}`}>Нет, пусть будут универсальными</button>
              </div>
              {params.gamePersonal === "yes" && (
                <textarea value={params.gameDetails || ""} onChange={(e) => update("gameDetails", e.target.value)} rows={2} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="Опиши, какие сюжеты и шутки нам стоит внедрить в игры" />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                История для комикса (5–10 предложений)
              </label>
              <textarea value={params.story || ""} onChange={(e) => update("story", e.target.value)} rows={4} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="Как вы познакомились? Смешное приключение, памятная поездка, случай, который до сих пор вспоминаете..." />
              <p className="text-xs text-gray-500 mt-2 italic">
                Не старайся писать красиво — расскажи своими словами. Кто участвовал? Где и когда? Что случилось? Чем закончилось? Какие фразы обязательно сохранить?
              </p>
            </div>
          </div>
        )}

        {/* ШАГ 5: ФИНАЛ */}
        {step === 5 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl md:text-3xl font-alumni italic font-black uppercase">
              Time to shine — финальные штрихи
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Через что раскрыть индивидуальность героя?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "playlist", t: "Плейлист" },
                  { v: "cinema", t: "Кино" },
                  { v: "style", t: "Стиль и образ" },
                  { v: "attributes", t: "Личные атрибуты" },
                ].map(o => (
                  <button type="button" key={o.v} onClick={() => update("imageType", o.v)} className={`p-3 border-2 border-black font-bold text-sm ${params.imageType === o.v ? "bg-kiosk-pink text-white" : "bg-white"}`}>
                    {o.t}
                  </button>
                ))}
              </div>

              <div className="mt-3">
                {params.imageType === "playlist" && (
                  <textarea value={params.playlist || ""} onChange={(e) => update("playlist", e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="5 треков — саундтрек жизни этого человека" />
                )}
                {params.imageType === "cinema" && (
                  <textarea value={params.cinema || ""} onChange={(e) => update("cinema", e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="5 фильмов, которые передают характер или историю человека" />
                )}
                {params.imageType === "style" && (
                  <textarea value={params.styleNote || ""} onChange={(e) => update("styleNote", e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="Какой стиль одежды ближе? Какие вещи, цвета и детали чаще всего в гардеробе?" />
                )}
                {params.imageType === "attributes" && (
                  <textarea value={params.attributes || ""} onChange={(e) => update("attributes", e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="5 предметов, которые невозможно отделить от этого человека: аксессуары, гаджеты, еда, символы..." />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Интервью: 6 вопросов для героя журнала
              </label>
              <textarea value={params.interviewQuestions || ""} onChange={(e) => update("interviewQuestions", e.target.value)} rows={3} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="Какая твоя главная мечта? ... — вопросы могут быть смешными, серьёзными, философскими или личными" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Wishes: оставим герою слова на память?</label>
              <textarea value={params.wishes || ""} onChange={(e) => update("wishes", e.target.value)} rows={3} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="Пожелания от тебя или отдельные послания от разных людей, если подарок от компании" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">
                Памятные фотографии <span className="normal-case text-gray-500 font-medium">(до {MAX_PHOTOS})</span>
              </label>
              <PhotoGrid photos={params.memoryPhotos || []} onAdd={(files) => addPhotos("memoryPhotos", files)} onRemove={(i) => removePhoto("memoryPhotos", i)} label="+ Ещё фото" />
              <p className="text-xs text-gray-500 mt-2 italic">
                Пусть у получателя останется память о близких и дорогих друзьях — прямо внутри журнала.
              </p>
            </div>

            <div className="bg-kiosk-pink/10 p-4 border-2 border-kiosk-pink text-sm font-medium">
              <strong>Готово!</strong> Нажми кнопку ниже — анкета улетит в редакцию, и мы начнём собирать твой личный номер.
            </div>
          </div>
        )}

        {/* НАВИГАЦИЯ */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t-2 border-dashed border-gray-400">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">
            {step < TOTAL_STEPS ? REMAINING[step - 1] : "ПОСЛЕДНИЙ ШАГ"}
          </span>
          <div className="flex gap-4 ml-auto">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="text-sm font-bold text-gray-500 hover:text-black uppercase underline decoration-2 underline-offset-4">
                Назад
              </button>
            )}
            <button type="submit" disabled={loading} className="bg-kiosk-pink text-white font-alumni italic font-black text-lg px-8 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all disabled:opacity-50 uppercase">
              {loading ? "ОТПРАВКА..." : step === TOTAL_STEPS ? "ОТПРАВИТЬ АНКЕТУ →" : "ДАЛЬШЕ →"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
