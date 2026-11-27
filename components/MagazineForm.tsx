"use client";

import { useState } from "react";
import type { MagazineParams, Mood } from "@/types/magazine";

interface Props {
  initialParams: MagazineParams;
  onGenerate: (params: MagazineParams) => void;
  loading: boolean;
}

const UNIVERSES = [
  "Смешарики", "Винкс", "Барби", "Монстр Хай", "Принцессы Дисней", 
  "Чародейки", "Hello Kitty", "My little pony", "Bratz", "Скубиду", 
  "Тачки", "Черепашки ниндзя", "Феи", "Трансформеры", "Hot Wheels", 
  "Звездные войны", "Корпорация монстров", "Ким 5+", "Кик Бутовски",
  "H2O", "Гарри Поттер", "Волшебники из Беверли-Хилс", "Ханна Монтана", 
  "Как стать принцессой за 10 дней", "Ранетки", "Дрянные девчонки"
];

const GAMES = ["Раскраска", "Рисунок по точкам", "Кроссворд", "Филворд", "Найди отличия", "Лабиринт"];

export default function MagazineForm({ initialParams, onGenerate, loading }: Props) {
  const [step, setStep] = useState(1);
  const [params, setParams] = useState<MagazineParams>({
    ...initialParams,
    universes: initialParams.universes || [],
    games: initialParams.games || [],
  });

  const update = (key: keyof MagazineParams, value: any) => 
    setParams(prev => ({ ...prev, [key]: value }));

  const toggleArrayItem = (key: "universes" | "games", item: string) => {
    setParams(prev => {
      const arr = prev[key] || [];
      if (arr.includes(item)) return { ...prev, [key]: arr.filter(i => i !== item) };
      return { ...prev, [key]: [...arr, item] };
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
    } else {
      const universesStr = (params.universes || []).join(" and ") || "Y2K";
      const aiPrompt = `Character named ${params.heroName || "Hero"}, ${params.uniqueness || "cool"}, associated with ${universesStr}. style of ${params.favoriteCharacter || "fashion"}. aesthetic: ${params.favoriteColor || "pink"}.`;
      onGenerate({ ...params, imagePrompt: aiPrompt });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-grid-paper text-black p-6 md:p-12 shadow-[12px_12px_0px_#000] border-2 border-gray-400 relative">
      {/* Скотч */}
      <div className="absolute -top-5 left-10 w-32 h-10 bg-[#00e5ff] rotate-[-4deg] shadow-sm z-10 opacity-90" />
      <div className="absolute -top-5 right-16 w-24 h-10 bg-[#ffe600] rotate-[5deg] shadow-sm z-10 opacity-90" />

      {/* АНИМИРОВАННЫЙ ПРОГРЕСС-БАР */}
      <div className="mb-12 mt-4">
        <div className="border-2 border-black rounded-full h-8 relative bg-white/90 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          
          {/* Заполненная часть, которая плавно растет */}
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-700 ease-out overflow-hidden rounded-r-full"
            style={{ width: `${(step / 4) * 100}%` }}
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

          {/* Деления между шагами (чтобы видеть, где закончится каждый шаг) */}
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="absolute top-0 h-full w-0.5 bg-black/20 z-10"
              style={{ left: `${(i / 4) * 100}%` }}
            />
          ))}

          {/* Текст шага */}
          <p className="absolute inset-0 text-center text-[11px] md:text-sm font-black leading-7 z-20 uppercase text-black tracking-widest drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
            ШАГ {step} ИЗ 4 — {step === 1 ? "ГЕРОЙ" : step === 2 ? "ЛИЧНОСТЬ" : step === 3 ? "ИСТОРИИ" : "ПОЖЕЛАНИЯ"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 font-inter text-black">
        <div className="fairy-divider style-rainbow" aria-hidden="true">{Array.from({length:24},(_,i)=><span key={i} className="light" style={{left:`${4+i*4}%`}} />)}</div>
        
        {/* ШАГ 1: Обложка и Вселенная */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-montserrat italic font-black uppercase">Обложка — знакомство с героем</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Имя героя</label>
                <input type="text" value={params.heroName || ""} onChange={(e) => update("heroName", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white" placeholder="Например, Саша" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Дата рождения</label>
                <input type="text" value={params.heroBirthdate || ""} onChange={(e) => update("heroBirthdate", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white" placeholder="12.05.2000" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Как к нему обращаться?</label>
                <input type="text" value={params.pseudonym || ""} onChange={(e) => update("pseudonym", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white" placeholder="Санёк, любимый..." />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Кто посланник подарка?</label>
                <select value={params.giverType || "self"} onChange={(e) => update("giverType", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink focus:bg-white">
                  <option value="self">Подарок от себя</option>
                  <option value="friends">Подарок от компании / друзей</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Выбери до 3 любимых вселенных</label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-white/30 border-2 border-dashed border-gray-300 rounded">
                {UNIVERSES.map(u => (
                  <button type="button" key={u} onClick={() => toggleArrayItem("universes", u)} className={`px-3 py-1.5 text-xs border-2 border-black font-bold transition ${(params.universes || []).includes(u) ? "bg-kiosk-pink text-white" : "bg-white hover:bg-gray-100"}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Загрузи фото героя (для обложки)</label>
              <label className="block w-full border-2 border-dashed border-gray-400 p-6 text-center text-sm font-bold text-gray-700 bg-white/40 hover:bg-white/70 cursor-pointer transition">
                <span className="block text-2xl mb-2">📷</span>
                {params.heroPhoto ? "Изменить фото героя" : "+ Нажми, чтобы загрузить фотографию"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file=e.target.files?.[0]; if(!file)return; if(file.size>3*1024*1024){alert('Фото должно быть меньше 3 МБ');return;} const reader=new FileReader(); reader.onload=()=>update('heroPhoto',String(reader.result)); reader.readAsDataURL(file); }} />
              </label>
              {params.heroPhoto && <div className="mt-3 relative max-w-xs mx-auto"><img src={params.heroPhoto} alt="Фото героя" className="w-full max-h-72 object-cover border-2 border-black shadow-md"/><button type="button" onClick={()=>update('heroPhoto','')} className="mt-2 px-3 py-1 bg-kiosk-pink text-white border-2 border-black text-xs font-bold">Удалить фото</button></div>}
            </div>
          </div>
        )}

        <div className="fairy-divider style-color" aria-hidden="true">{Array.from({length:20},(_,i)=><span key={i} className="light" style={{left:`${5+i*4.5}%`}} />)}</div>

        {/* ШАГ 2: Личность и Портрет */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-montserrat italic font-black uppercase">Личность героя</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Город</label>
                <input type="text" value={params.city || ""} onChange={(e) => update("city", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Любимый персонаж</label>
                <input type="text" value={params.favoriteCharacter || ""} onChange={(e) => update("favoriteCharacter", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Любимый цвет</label>
                <input type="text" value={params.favoriteColor || ""} onChange={(e) => update("favoriteColor", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Питомец</label>
                <input type="text" value={params.pet || ""} onChange={(e) => update("pet", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Что в нем есть такого, чего нет в других?</label>
              <textarea value={params.uniqueness || ""} onChange={(e) => update("uniqueness", e.target.value)} rows={2} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Вариант наполнения (Портрет)</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => update("portraitType", "world")} className={`flex-1 p-3 border-2 border-black font-bold text-sm ${params.portraitType === "world" ? "bg-kiosk-cyan" : "bg-white"}`}>Маленький мир героя</button>
                <button type="button" onClick={() => update("portraitType", "letter")} className={`flex-1 p-3 border-2 border-black font-bold text-sm ${params.portraitType === "letter" ? "bg-kiosk-cyan" : "bg-white"}`}>Письмо тебе</button>
              </div>
            </div>

            {params.portraitType === "world" ? (
              <div className="grid grid-cols-2 gap-4 bg-kiosk-cyan/20 p-4 border-2 border-dashed border-cyan-400">
                <input type="text" placeholder="Любимая еда" value={params.favoriteFood || ""} onChange={(e) => update("favoriteFood", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded" />
                <input type="text" placeholder="Любимое место" value={params.favoritePlace || ""} onChange={(e) => update("favoritePlace", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded" />
                <input type="text" placeholder="Любимое хобби" value={params.favoriteHobby || ""} onChange={(e) => update("favoriteHobby", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded" />
              </div>
            ) : (
              <textarea placeholder="Напиши слова, которые давно хотел сказать..." rows={3} value={params.personalLetter || ""} onChange={(e) => update("personalLetter", e.target.value)} className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded" />
            )}
          </div>
        )}

        {/* ШАГ 3: Игры и Комикс */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-montserrat italic font-black uppercase">Истории и Игромания</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase mb-2">Выбери игры (3-4 шт)</label>
              <div className="flex flex-wrap gap-2">
                {GAMES.map(g => (
                  <button type="button" key={g} onClick={() => toggleArrayItem("games", g)} className={`px-3 py-1.5 text-xs border-2 border-black font-bold transition ${(params.games || []).includes(g) ? "bg-kiosk-yellow" : "bg-white"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">История для комикса (5-10 предложений)</label>
              <textarea value={params.story || ""} onChange={(e) => update("story", e.target.value)} rows={4} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="Как вы познакомились? Что случилось в той поездке?" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Вопросы для интервью (6 шт)</label>
              <textarea value={params.interviewQuestions || ""} onChange={(e) => update("interviewQuestions", e.target.value)} rows={3} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="Какая твоя главная мечта? ..." />
            </div>
          </div>
        )}

        {/* ШАГ 4: Пожелания и Стиль */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-montserrat italic font-black uppercase">Пожелания и Стиль</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Оставим герою слова на память?</label>
              <textarea value={params.wishes || ""} onChange={(e) => update("wishes", e.target.value)} rows={3} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded focus:outline-none focus:border-kiosk-pink" placeholder="С днем рождения! Ты лучший..." />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Как раскрыть индивидуальность?</label>
              <select value={params.imageType || "playlist"} onChange={(e) => update("imageType", e.target.value)} className="w-full px-3 py-2 bg-white/50 border-2 border-dashed border-gray-400 rounded">
                <option value="playlist">Плейлист (5 треков)</option>
                <option value="cinema">Кино (5 фильмов)</option>
                <option value="style">Стиль и образ</option>
                <option value="attributes">Личные атрибуты</option>
              </select>
            </div>

            <div className="bg-kiosk-pink/10 p-4 border-2 border-kiosk-pink text-sm font-medium">
              <strong>Готово!</strong> Нажми кнопку ниже, и наш искусственный интеллект соберет все ответы, чтобы создать уникальную обложку в выбранной тобой вселенной!
            </div>
          </div>
        )}

        {/* НАВИГАЦИЯ */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t-2 border-dashed border-gray-400">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">
            Осталось {4 - step} шага
          </span>
          <div className="flex gap-4">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="text-sm font-bold text-gray-500 hover:text-black uppercase underline decoration-2 underline-offset-4">
                Назад
              </button>
            )}
            <button type="submit" disabled={loading} className="bg-kiosk-pink text-white font-montserrat italic font-black text-lg px-8 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all disabled:opacity-50 uppercase">
              {loading ? "ГЕНЕРАЦИЯ..." : step === 4 ? "СОЗДАТЬ ЖУРНАЛ →" : "ДАЛЬШЕ →"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}