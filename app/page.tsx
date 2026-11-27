"use client";

import { useState } from "react";
import MagazineForm from "@/components/MagazineForm";
import { DEFAULT_PARAMS, STORAGE_KEY } from "@/types/magazine";
import type { MagazineParams } from "@/types/magazine";

export default function Home() {
  const [navigating, setNavigating] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false); // Состояние для окна "Заказ отправлен"

    const handleGenerate = async (params: MagazineParams) => {
    setNavigating(true);
    
    try {
      // Отправляем заказ на сервер
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error("Ошибка отправки");

      // Сохраняем локально (на всякий случай)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
      
      // Показываем окно успеха
      setIsOrdered(true); 
    } catch (error) {
      alert("Не удалось отправить заказ. Попробуйте еще раз.");
    } finally {
      setNavigating(false);
    }
  };

  return (
    <main className="min-h-screen font-inter text-white bg-[#1a0b2e]">
      
      {/* МОДАЛЬНОЕ ОКНО "ЗАКАЗ ОТПРАВЛЕН" */}
      {isOrdered && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-grid-paper text-black p-5 sm:p-8 md:p-12 max-w-lg w-full text-center relative border-4 border-black shadow-[10px_10px_0px_#ff007f] rotate-1 animate-fade-in my-auto">
            {/* Скотч */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-400/80 rotate-2 shadow-sm z-10" />
            
            <h2 className="text-4xl md:text-5xl font-montserrat italic font-black text-kiosk-purple uppercase mb-4 leading-tight">
              Заказ отправлен!
            </h2>
            <p className="text-lg font-bold mb-6">
              Твоя анкета улетела в редакцию. Мы уже достаем ножницы, клей и достаем лучшие фотографии.
            </p>
            <div className="bg-white border-2 border-black p-4 mb-8 shadow-[3px_3px_0px_#000]">
              <p className="font-neucha text-2xl text-kiosk-pink">
                «Совсем скоро твой личный журнал будет готов!»
              </p>
            </div>
            
            <button 
              onClick={() => setIsOrdered(false)}
              className="bg-kiosk-pink text-white font-montserrat italic font-bold text-lg px-8 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all uppercase"
            >
              Отлично!
            </button>
          </div>
        </div>
      )}

      {/* ШАПКА */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a0b2e]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center">
        <a
  href="#hero"
  className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 border-pink-500 bg-white flex items-center justify-center shadow-[0_0_15px_#ff007f] overflow-hidden hover:scale-105 transition-transform shrink-0"
>
  <img src="/kiosk-logo.png" alt="Kiosk Logo" className="w-full h-full object-cover" />
</a>
        <a
  href="#form"
  className="bg-kiosk-pink text-white font-montserrat italic font-bold text-[11px] sm:text-sm px-4 sm:px-6 py-2 rounded-full border-2 border-white shadow-[3px_3px_0px_#000] uppercase text-center"
>
  Заполнить анкету
</a>
      </header>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-12 md:pb-20 flex gap-12">
        
        {/* ЛЕВОЕ МЕНЮ */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-28 flex flex-col gap-6 font-montserrat italic font-black text-xl uppercase tracking-tighter">
            <a href="#hero" className="text-kiosk-yellow flex flex-col">
              Главная <span className="text-xs text-white/50 tracking-normal not-italic font-medium mt-1">→ титульный лист</span>
            </a>
            <a href="#about" className="text-white hover:text-kiosk-yellow transition-colors flex flex-col">
              О нас <span className="text-xs text-white/50 tracking-normal not-italic font-medium mt-1">это не просто журнал</span>
            </a>
            <a href="#inside" className="text-white hover:text-kiosk-yellow transition-colors flex flex-col">
              Что внутри? <span className="text-xs text-white/50 tracking-normal not-italic font-medium mt-1">обложка · комикс · тест</span>
            </a>
            <a href="#how" className="text-white hover:text-kiosk-yellow transition-colors flex flex-col">
              Как заказать? <span className="text-xs text-white/50 tracking-normal not-italic font-medium mt-1">5 шагов</span>
            </a>
            <a href="#price" className="text-white hover:text-kiosk-yellow transition-colors flex flex-col">
              Цена <span className="text-xs text-white/50 tracking-normal not-italic font-medium mt-1">от чего зависит</span>
            </a>
            <a href="#issues" className="text-white hover:text-kiosk-yellow transition-colors flex flex-col">
              Наши выпуски <span className="text-xs text-white/50 tracking-normal not-italic font-medium mt-1">повод есть всегда</span>
            </a>
            <a href="#form" className="text-white hover:text-kiosk-yellow transition-colors flex flex-col">
              Анкета <span className="text-xs text-white/50 tracking-normal not-italic font-medium mt-1">беги заполнять</span>
            </a>
          </nav>
        </aside>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex-1 min-w-0 max-w-5xl space-y-20 md:space-y-32">
          
          {/* 1. HERO */}
          <section id="hero" className="relative pt-8 md:pt-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 px-4 md:px-0">
            <div className="flex-1">
              <div className="bg-kiosk-pink text-white font-bold text-xs px-4 py-1 w-max -rotate-2 mb-6 shadow-[3px_3px_0px_#000] uppercase tracking-wider">
                Специальный выпуск о тебе
              </div>
              <h1 className="text-[120px] md:text-[160px] font-montserrat italic font-black text-outline-pink uppercase leading-[0.8] mb-6">
                КИОСК
              </h1>
              <p className="text-2xl md:text-3xl text-kiosk-yellow font-montserrat italic font-bold mb-8">
                журнал, которого не было ни в одном киоске
              </p>
              <p className="text-white/90 max-w-xl text-lg leading-relaxed mb-10">
                Помнишь запах нового журнала из киоска? Игрушка, которая шла в комплекте. Тест «На сколько хорошо ты знаешь…?». Все эти журналы были про кого-то. <strong className="text-white">Мы сделали наоборот. Главный герой – реальный человек.</strong>
              </p>
              <div className="flex gap-4">
                <a href="#form" className="bg-kiosk-pink text-white font-montserrat italic font-bold text-sm px-8 py-3 rounded-full border-2 border-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all">
                  СОБРАТЬ СВОЙ ВЫПУСК
                </a>
                <a href="#issues" className="bg-transparent text-white font-montserrat italic font-bold text-sm px-8 py-3 rounded-full border-2 border-white hover:bg-white/10 transition-all">
                  ПОСМОТРЕТЬ НОМЕРА
                </a>
              </div>
            </div>

            
{/* 1. HERO */}
<section
  id="hero"
  className="relative pt-4 md:pt-10 flex flex-col md:flex-row items-center gap-8 md:gap-8"
>
  {/* Текст */}
  <div className="flex-1 w-full min-w-0">
    <div className="bg-kiosk-pink text-white font-bold text-xs px-4 py-1 w-max max-w-full -rotate-2 mb-6 shadow-[3px_3px_0px_#000] uppercase tracking-wider">
      Специальный выпуск о тебе
    </div>

    <h1 className="text-[clamp(3.5rem,15vw,10rem)] font-montserrat italic font-black text-outline-pink uppercase leading-[0.85] mb-6">
      КИОСК
    </h1>

    <p className="text-xl sm:text-2xl md:text-3xl text-kiosk-yellow font-montserrat italic font-bold mb-6 md:mb-8">
      журнал, которого не было ни в одном киоске
    </p>

    <p className="text-white/90 max-w-xl text-base sm:text-lg leading-relaxed mb-8">
      Помнишь запах нового журнала из киоска? Игрушка, которая шла в комплекте. Тест «На сколько хорошо ты знаешь…?». Все эти журналы были про кого-то.{" "}
      <strong className="text-white">
        Мы сделали наоборот. Главный герой – реальный человек.
      </strong>
    </p>

    <div className="flex flex-col sm:flex-row flex-wrap gap-4">
      <a
        href="#form"
        className="bg-kiosk-pink text-white font-montserrat italic font-bold text-sm px-6 sm:px-8 py-3 rounded-full border-2 border-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all text-center"
      >
        СОБРАТЬ СВОЙ ВЫПУСК
      </a>

      <a
        href="#issues"
        className="bg-transparent text-white font-montserrat italic font-bold text-sm px-6 sm:px-8 py-3 rounded-full border-2 border-white hover:bg-white/10 transition-all text-center"
      >
        ПОСМОТРЕТЬ НОМЕРА
      </a>
    </div>
  </div>

  {/* Дракулаура */}
  <div className="w-full md:flex-1 relative flex justify-center items-center">
    <div className="relative w-full max-w-[300px] h-[360px] sm:max-w-[400px] sm:h-[480px] md:max-w-[500px] md:h-[650px] flex items-end justify-center">
      <img
        src="/draculaura.png"
        alt="Draculaura"
        className="w-full h-full object-contain object-bottom md:scale-110 drop-shadow-[0_0_30px_rgba(255,0,127,0.6)]"
      />

      <div className="absolute top-4 right-0 sm:top-10 bg-[#1a0b2e] border-2 border-dashed border-kiosk-cyan/50 p-2 sm:p-3 rounded-sm text-center text-[10px] sm:text-xs font-bold text-kiosk-yellow shadow-lg rotate-3">
        <span className="text-white">№ 001</span>
        <br />
        ВЕСНА 2026
        <br />
        <span className="text-white/50 text-[9px] sm:text-[10px]">
          ТИРАЖ: 1 ШТ.
        </span>
      </div>
    </div>
  </div>
</section>

          {/* 2. О НАС */}
          <section id="about" className="relative">
            <div className="bg-paper text-black rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[10px_10px_0px_#ff007f] border-4 border-white/20 relative">
              <div className="flex-1 p-8 md:p-12 relative border-b-4 md:border-b-0 md:border-r-4 border-gray-300 bg-grid-paper">
                <h2 className="text-3xl md:text-5xl font-montserrat italic font-black text-kiosk-purple uppercase mb-6 leading-tight">
                  Мы вернули те самые журналы
                </h2>
                <div className="space-y-4 text-sm md:text-base font-medium">
                  <p>В детстве всё важное было на бумаге: обложка с обладателем премии, вкладыш с наклейками, страница с тестом, который решал, кем тебе быть в этом месяце.</p>
                  <p className="font-bold">Выбирать журнал у киоска было целым событием — ты держал его в руках, листал прямо у стенки и уносил домой.</p>
                  <p>Мы сделали «Киоск» из тоски по этим ощущениям. Только теперь на обложке — не дальняя звезда, а твой одногруппник, твоя сестра или человек, с которым у вас своя история.</p>
                </div>
                <p className="font-neucha text-2xl text-kiosk-pink mt-8">бумага, клей, ножницы и очень много любви</p>
              </div>
              
              <div className="flex-1 p-8 flex flex-col justify-center items-center bg-[#f4ecd8] relative overflow-hidden min-h-[400px]">
                <img src="/silhouette.png" alt="Silhouette" className="absolute -bottom-8 -left-8 w-64 opacity-90 z-0 pointer-events-none" />
                <div className="relative z-10 w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] bg-white shadow-2xl flex items-center justify-center mb-6 rotate-2 p-1 border-2 border-gray-300 hover:rotate-0 transition-transform duration-300">
   <img
     src="/magazine-cover.jpg"
     alt="Magazine Cover"
     className="w-full h-auto object-cover"
   />
</div>
                <div className="relative z-10 bg-yellow-200 p-4 w-full max-w-xs font-bold text-center border-2 border-black -rotate-1 text-sm shadow-[3px_3px_0px_#000]">
                  «Каждый номер печатается в одном экземпляре — второго такого не будет»
                </div>
              </div>
            </div>
          </section>

          {/* 3. ЧТО ВНУТРИ */}
          <section id="inside">
            <h2 className="text-center text-5xl md:text-7xl font-montserrat italic font-black text-outline-pink mb-12 uppercase">
              Что внутри журнала?
            </h2>
            
            <div className="bg-grid-paper p-6 md:p-12 rounded-lg shadow-2xl relative border-4 border-[#e5dec5]">
              <div className="absolute -top-4 left-10 w-24 h-8 bg-cyan-400/80 rotate-[-5deg] shadow-sm z-10" />
              <div className="absolute -top-4 right-20 w-20 h-8 bg-yellow-400/80 rotate-[3deg] shadow-sm z-10" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                <div className="flex flex-col relative mt-4">
                  <div className="bubble-cyan p-4 font-bold text-sm md:text-base w-[90%] z-10">Ну и что там вообще внутри?</div>
                  <div className="answer-card p-5 -mt-2 ml-4 w-[90%]">
                    <div className="absolute -right-3 -top-3 w-8 h-8 bg-kiosk-pink rounded-full border-2 border-black flex items-center justify-center text-white text-[10px] font-bold rotate-12">СТР 1</div>
                    <h3 className="font-montserrat italic font-black text-xl mb-1 text-kiosk-pink">ОБЛОЖКА</h3>
                    <p className="text-sm font-medium">Фото твоего человека, его имя и номер выпуска — как в том самом журнале из детства.</p>
                  </div>
                </div>

                <div className="flex flex-col relative mt-4">
                  <div className="bubble-cyan p-4 font-bold text-sm md:text-base w-[90%] z-10">А кто это всё придумал?</div>
                  <div className="answer-card p-5 -mt-2 ml-4 w-[90%]">
                    <div className="absolute -right-3 -top-3 w-8 h-8 bg-kiosk-pink rounded-full border-2 border-black flex items-center justify-center text-white text-[10px] font-bold -rotate-12">СТР 2</div>
                    <h3 className="font-montserrat italic font-black text-xl mb-1 text-kiosk-pink">ПИСЬМО РЕДАКТОРА</h3>
                    <p className="text-sm font-medium">Для попсов и о том, почему мы снова делаем бумагу, и что в ней важнее экрана.</p>
                  </div>
                </div>

                <div className="flex flex-col relative mt-4">
                  <div className="bubble-cyan p-4 font-bold text-sm md:text-base w-[90%] z-10">А комиксы есть? Без них не считается!</div>
                  <div className="answer-card p-5 -mt-2 ml-4 w-[90%]">
                    <div className="absolute -right-3 -top-3 w-8 h-8 bg-kiosk-pink rounded-full border-2 border-black flex items-center justify-center text-white text-[10px] font-bold rotate-12">СТР 6</div>
                    <h3 className="font-montserrat italic font-black text-xl mb-1 text-kiosk-pink">КОМИКС</h3>
                    <p className="text-sm font-medium">Целый разворот, где во главе всего — ваша история: как вы познакомились и что было потом.</p>
                  </div>
                </div>

                <div className="flex flex-col relative mt-4">
                  <div className="bubble-cyan p-4 font-bold text-sm md:text-base w-[90%] z-10">Меня заставят проходить тесты?</div>
                  <div className="answer-card p-5 -mt-2 ml-4 w-[90%]">
                    <div className="absolute -right-3 -top-3 w-8 h-8 bg-kiosk-pink rounded-full border-2 border-black flex items-center justify-center text-white text-[10px] font-bold -rotate-12">СТР 4</div>
                    <h3 className="font-montserrat italic font-black text-xl mb-1 text-kiosk-pink">ТЕСТ</h3>
                    <p className="text-sm font-medium">«Кто ты: партнёр по кино-вечерам?» — с ответами на полях и вердиктом редакции.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 border-t-2 border-dashed border-gray-400 pt-8">
                <p className="font-montserrat italic font-black text-xl md:text-2xl text-kiosk-yellow text-outline-purple">
                  ХВАТИТ ЧИТАТЬ — ПОРА ДЕЛАТЬ СВОЙ НОМЕР!
                </p>
                <a href="#form" className="bg-kiosk-pink text-white font-bold text-sm px-6 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all uppercase">
                  Заполнить анкету
                </a>
              </div>
            </div>
          </section>

          {/* 4. КАК ЗАКАЗАТЬ (5 шагов) */}
          <section id="how">
            <h2 className="text-center text-5xl md:text-6xl font-montserrat italic font-black text-outline-cyan mb-16 uppercase">
              Как заказать свой номер?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: 1, title: "ВЫБЕРИ ПОВОД", text: "Classic, Happy birthday или To my love." },
                { num: 2, title: "ЗАПОЛНИ АНКЕТУ", text: "Расскажи о герое и загрузи фото." },
                { num: 3, title: "МЫ СДЕЛАЕМ НОМЕР", text: "Пишем тексты, собираем обложку." },
                { num: 4, title: "ЗАБИРАЙ И ДАРИ", text: "Доставим СДЭКОМ или ОЗОН." },
              ].map((step) => (
                <div key={step.num} className="bg-paper text-black p-6 pt-8 relative border-2 border-black shadow-[4px_4px_0px_#ff007f]">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-kiosk-pink text-white rounded-full flex items-center justify-center font-montserrat font-black text-xl border-2 border-black">
                    {step.num}
                  </div>
                  <h3 className="font-montserrat italic font-black text-lg mb-2 text-center">{step.title}</h3>
                  <p className="text-sm font-medium text-center">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. ЦЕНА */}
          <section id="price">
            <h2 className="text-center text-5xl md:text-6xl font-montserrat italic font-black text-outline-cyan mb-12 uppercase">
              Цена (от чего зависит)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#f8c8dc] text-[#3a1524] p-8 rounded-[2rem] flex flex-col h-full border-4 border-[#e59fb6]">
                <h3 className="font-montserrat font-bold text-2xl mb-2 uppercase">КЛАССИК</h3>
                <p className="text-sm font-medium mb-6">Для любого повода: выпускной, 8 марта, просто порадовать.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#e59fb6]">24-40 фото</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#e59fb6]">12 разворотов</span>
                </div>
                <p className="font-montserrat font-black text-3xl mb-8 mt-auto">от 3 000 руб.</p>
                <a href="#form" className="bg-white text-black font-bold py-3 px-6 rounded-full w-full border-2 border-black hover:bg-gray-100 transition-colors uppercase text-sm text-center block">
                  Выбрать
                </a>
              </div>

              <div className="bg-[#c0e8f9] text-[#1a3a4c] p-8 rounded-[2rem] flex flex-col h-full border-4 border-[#8ad1ed] relative">
                <div className="absolute top-4 right-4 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white">Хит</div>
                <h3 className="font-montserrat font-bold text-2xl mb-2 uppercase">ДЕНЬ РОЖДЕНИЯ</h3>
                <p className="text-sm font-medium mb-6">Праздничная версия с поздравлением и пожеланиями от близких.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#8ad1ed]">Больше фото</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#8ad1ed]">20 разворотов</span>
                </div>
                <p className="font-montserrat font-black text-3xl mb-8 mt-auto">от 3 500 руб.</p>
                <a href="#form" className="bg-white text-black font-bold py-3 px-6 rounded-full w-full border-2 border-black hover:bg-gray-100 transition-colors uppercase text-sm text-center block">
                  Выбрать
                </a>
              </div>

              <div className="bg-[#f9d8b6] text-[#4a2c16] p-8 rounded-[2rem] flex flex-col h-full border-4 border-[#eab582]">
                <h3 className="font-montserrat font-bold text-2xl mb-2 uppercase">МОЯ ЛЮБОВЬ</h3>
                <p className="text-sm font-medium mb-6">Для второй половинки. Романтичная записка и гороскоп.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#eab582]">99-150 фото</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#eab582]">30 разворотов</span>
                </div>
                <p className="font-montserrat font-black text-3xl mb-8 mt-auto">от 4 000 руб.</p>
                <a href="#form" className="bg-white text-black font-bold py-3 px-6 rounded-full w-full border-2 border-black hover:bg-gray-100 transition-colors uppercase text-sm text-center block">
                  Выбрать
                </a>
              </div>

            </div>
          </section>

          {/* 6. ВЫПУСКИ */}
<section id="issues">
  <h2 className="text-center text-5xl md:text-6xl font-montserrat italic font-black text-outline-cyan mb-16 uppercase">
    Наши выпуски
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
    {[
      {
        name: "CLASSIC",
        title: "Для любого повода",
        color: "bg-kiosk-pink",
        image: "/magazine1.png",
      },
      {
        name: "HAPPY B-DAY",
        title: "Праздничная версия",
        color: "bg-kiosk-cyan text-black",
        image: "/magazine2.png",
      },
      {
        name: "TO MY LOVE",
        title: "Для второй половинки",
        color: "bg-kiosk-yellow text-black",
        image: "/magazine3.jpg",
      },
    ].map((issue, i) => (
      <div key={i} className="flex flex-col">
        <div className="aspect-[3/4] bg-gray-800 border-4 border-black shadow-[5px_5px_0px_#ff007f] relative overflow-hidden group">

          <img
            src={issue.image}
            alt={issue.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <span className={`absolute bottom-4 right-4 ${issue.color} font-bold text-xs px-3 py-1.5 border-2 border-black rotate-3 z-10`}>
            {issue.name}
          </span>

        </div>

        <h4 className="font-montserrat font-black text-lg text-kiosk-yellow mt-4 text-center">
          {issue.title}
        </h4>
      </div>
    ))}
  </div>
</section>

          {/* 7. АНКЕТА */}
          <section id="form" className="pt-10">
            <div className="w-full max-w-4xl mx-auto text-center mb-10">
              <h2 className="text-5xl md:text-7xl font-montserrat italic font-black text-outline-pink uppercase mb-4">
                Анкета будущего номера
              </h2>
              <p className="text-white/70 italic font-bold">Заполни все шаги — и мы создадим твой личный журнал</p>
            </div>
            <MagazineForm
              initialParams={DEFAULT_PARAMS}
              onGenerate={handleGenerate}
              loading={navigating}
            />
          </section>

        </div>
      </div>

      {/* 8. ФУТЕР */}
      <footer className="border-t-2 border-white/10 bg-[#10051a] py-16 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="w-20 h-20 rounded-full border-2 border-pink-500 bg-white flex items-center justify-center mb-6 shadow-[0_0_20px_#ff007f] overflow-hidden">
              <img src="/kiosk-logo.png" alt="Kiosk Logo" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-4xl font-montserrat italic font-black text-white mb-2 uppercase">КИОСК</h3>
            <p className="font-neucha text-kiosk-yellow text-xl">
              Печатаем чувства. Поштучно, на бумаге, с наклейками.
            </p>
          </div>
          
          <div>
            <h4 className="font-montserrat italic font-black text-lg text-white mb-6 uppercase">В номере</h4>
            <ul className="space-y-3 font-bold text-sm text-kiosk-pink">
              <li><a href="#about" className="hover:underline">О бренде</a></li>
              <li><a href="#inside" className="hover:underline">Что внутри</a></li>
              <li><a href="#how" className="hover:underline">Как заказать</a></li>
              <li><a href="#issues" className="hover:underline">Выпуски</a></li>
              <li><a href="#form" className="hover:underline">Анкета</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat italic font-black text-lg text-white mb-6 uppercase">Связь</h4>
            <ul className="space-y-3 font-bold text-sm text-kiosk-pink">
              <li><a href="#" className="hover:underline">ПОЧТА</a></li>
              <li><a href="#" className="hover:underline">ТЕЛЕГРАМ</a></li>
              <li><a href="#" className="hover:underline">ИНСТАГРАМ</a></li>
            </ul>
            <p className="text-white/40 text-xs mt-6 font-bold">Москва, у любимого метро, с 2026 года</p>
          </div>
        </div>
      </footer>
    </main>
  );
}