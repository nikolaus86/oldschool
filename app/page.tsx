
"use client";

import { useEffect, useState } from "react";
import MagazineForm from "@/components/MagazineForm";
import { DEFAULT_PARAMS, STORAGE_KEY } from "@/types/magazine";
import type { MagazineParams } from "@/types/magazine";

export default function Home() {
  const [navigating, setNavigating] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const menuItems = [
    { id: "hero", title: "Главная", sub: "→ титульный лист" },
    { id: "about", title: "Приветствие", sub: "с чего всё началось" },
    { id: "inside", title: "Что внутри", sub: "обложка · комикс · тест" },
    { id: "how", title: "Как заказать?", sub: "4 простых шага" },
    { id: "issues", title: "Выпуски", sub: "примеры номеров" },
    { id: "form", title: "Анкета", sub: "расскажи о герое" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    menuItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleGenerate = async (params: MagazineParams) => {
    setNavigating(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error("Ошибка отправки");

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
      setIsOrdered(true);
    } catch (error) {
      alert("Не удалось отправить заказ. Попробуйте еще раз.");
    } finally {
      setNavigating(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden font-inter text-white bg-[#1a0b2e]">

      {/* МОДАЛЬНОЕ ОКНО */}
      {isOrdered && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-grid-paper text-black p-5 sm:p-8 md:p-12 max-w-lg w-full text-center relative border-4 border-black shadow-[10px_10px_0px_#ff007f] rotate-1 animate-fade-in my-auto">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-400/80 rotate-2 shadow-sm z-10" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-alumni italic font-black text-kiosk-purple uppercase mb-4 leading-tight">
              Заказ отправлен!
            </h2>

            <p className="text-base sm:text-lg font-bold mb-6">
              Твоя анкета улетела в редакцию. Мы уже достаем ножницы, клей и достаем лучшие фотографии.
            </p>

            <div className="bg-white border-2 border-black p-4 mb-8 shadow-[3px_3px_0px_#000]">
              <p className="font-neucha text-xl sm:text-2xl text-kiosk-pink">
                «Совсем скоро твой личный журнал будет готов!»
              </p>
            </div>

            <button
              onClick={() => setIsOrdered(false)}
              className="bg-kiosk-pink text-white font-alumni italic font-black text-lg px-8 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all uppercase"
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
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-pink-500 bg-white flex items-center justify-center shadow-[0_0_15px_#ff007f] overflow-hidden hover:scale-105 transition-transform shrink-0"
        >
          <img
            src="/kiosk-logo.png"
            alt="Kiosk Logo"
            className="w-full h-full object-cover scale-[1.62]"
          />
        </a>

        <a
          href="#form"
          className="bg-kiosk-pink text-white font-alumni italic font-black text-sm sm:text-base px-4 sm:px-6 py-2 rounded-full border-2 border-white shadow-[3px_3px_0px_#000] uppercase text-center"
        >
          Заполнить анкету
        </a>
      </header>

      {/* ОСНОВНОЙ КОНТЕЙНЕР */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-12 md:pb-20 flex gap-12">

        {/* ЛЕВОЕ МЕНЮ */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-28 flex flex-col gap-6 font-alumni italic font-black text-2xl uppercase tracking-tight">

            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex flex-col transition-colors ${
                  activeSection === item.id
                    ? "text-kiosk-yellow"
                    : "text-white hover:text-kiosk-yellow"
                }`}
              >
                {item.title}
                <span className="text-xs text-white/50 tracking-normal not-italic font-medium mt-1">
                  {item.sub}
                </span>
              </a>
            ))}

          </nav>
        </aside>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex-1 min-w-0 max-w-5xl space-y-20 md:space-y-32">

          {/* 1. HERO */}
          <section
            id="hero"
            className="relative pt-4 md:pt-10 flex flex-col md:flex-row items-center gap-8"
          >

            {/* ТЕКСТ */}
            <div className="flex-1 w-full min-w-0">

              <div className="bg-kiosk-pink text-white font-bold text-xs px-4 py-1 w-max max-w-full -rotate-2 mb-6 shadow-[3px_3px_0px_#000] uppercase tracking-wider">
                Специальный выпуск о тебе
              </div>

              <h1 className="mb-6 w-full">
                <span className="sr-only">КИОСК</span>
                <svg viewBox="0 0 340 100" className="block w-full h-auto overflow-visible" aria-hidden="true">
                  <text
                    x="0"
                    y="80"
                    textLength="322"
                    lengthAdjust="spacingAndGlyphs"
                    className="font-alumni italic font-black uppercase"
                    style={{
                      fontSize: "92px",
                      fill: "#ffffff",
                      stroke: "#ff007f",
                      strokeWidth: 4,
                      paintOrder: "stroke",
                      filter: "drop-shadow(6px 6px 0px #000)",
                    }}
                  >
                    КИОСК
                  </text>
                </svg>
              </h1>

              <p className="text-xl sm:text-2xl md:text-3xl text-kiosk-yellow font-montserrat italic font-extrabold mb-6 md:mb-8">
                журнал, которого не было ни в одном киоске
              </p>

              <p className="text-white/90 max-w-xl text-base sm:text-lg leading-relaxed mb-8">
                Помнишь, как выбирал журналы у дома? Мы вернули это чувство — только теперь{" "}
                <strong className="text-white">
                  каждый номер посвящён твоему человеку
                </strong>
                : обложка с его лицом, письмо редактора, комикс, тесты и лист стикеров внутри.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4">

                <a
                  href="#form"
                  className="bg-kiosk-pink text-white font-alumni italic font-black text-base px-6 sm:px-8 py-3 rounded-full border-2 border-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all text-center"
                >
                  СОБРАТЬ СВОЙ ВЫПУСК
                </a>

                <a
                  href="#issues"
                  className="bg-[#2a1245] text-kiosk-yellow font-alumni italic font-black text-base px-6 sm:px-8 py-3 rounded-full border-2 border-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all text-center"
                >
                  ПОСМОТРЕТЬ НОМЕРА
                </a>

              </div>

              {/* Стикер «НОВЫЙ ВЫПУСК!» */}
              <div className="starburst mt-6 sm:mt-8 w-max -rotate-12">
                НОВЫЙ
                <br />
                ВЫПУСК!
              </div>
            </div>

            {/* ДРАКУЛАУРА */}
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

              <div className="flex-1 min-w-0 p-5 sm:p-8 md:p-12 relative border-b-4 md:border-b-0 md:border-r-4 border-gray-300 bg-grid-paper">

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-alumni italic font-black text-kiosk-purple uppercase mb-6 leading-tight">
                  Мы вернули те самые журналы
                </h2>

                <div className="space-y-4 text-sm sm:text-base font-medium">
                  <p>
                    В детстве всё важное было на бумаге: обложка с обладателем премии, вкладыш с наклейками, страница с тестом, который решал, кем тебе быть в этом месяце.
                  </p>

                  <p className="font-bold">
                    <span className="bg-kiosk-yellow/90 px-1 box-decoration-clone">
                      Выбирать журнал у киоска было целым событием
                    </span>{" "}
                    — ты держал его в руках, листал прямо у стенки и уносил домой.
                  </p>

                  <p>
                    Мы сделали «Киоск» из тоски по этим ощущениям. Только теперь на обложке — не дальняя звезда, а твой одногруппник, твоя сестра или человек, с которым у вас своя история.
                  </p>
                </div>

                <p className="font-neucha text-2xl text-kiosk-pink mt-8">
                  бумага, клей, ножницы и очень много любви
                </p>

              </div>

              <div className="flex-1 min-w-0 p-5 sm:p-8 flex flex-col justify-center items-center bg-[#f4ecd8] relative overflow-hidden min-h-[400px]">

                <img
                  src="/silhouette.png"
                  alt="Silhouette"
                  className="absolute -bottom-8 -left-8 w-64 max-w-[70%] opacity-90 z-0 pointer-events-none"
                />

                <div className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] bg-white shadow-2xl flex items-center justify-center mb-6 rotate-2 p-1 border-2 border-gray-300 hover:rotate-0 transition-transform duration-300">

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

            {/* Розовый баннер под разворотом — как в референсе */}
            <div className="mt-8 md:mt-10 flex justify-center px-2">
              <div className="bg-kiosk-pink text-white font-alumni italic font-black text-lg sm:text-xl md:text-2xl uppercase text-center leading-snug px-6 sm:px-10 py-4 sm:py-5 max-w-2xl border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.35)] -rotate-1">
                Не лента, не сторис, не скриншот — а журнал, который можно поставить на полку
              </div>
            </div>
          </section>

          {/* 3. ЧТО ВНУТРИ ЖУРНАЛА */}
          <section id="inside">

            <h2 className="text-center text-3xl sm:text-5xl md:text-7xl font-alumni italic font-black text-outline-pink mb-4 uppercase">
              Что внутри журнала
            </h2>

            <p className="text-center text-kiosk-cyan italic font-bold text-sm mb-10 md:mb-12">
              Открываешь журнал — и начинается диалог…
            </p>

            <div className="bg-grid-paper p-5 sm:p-6 md:p-12 rounded-lg shadow-2xl relative border-4 border-[#e5dec5]">

              <div className="absolute -top-4 left-5 sm:left-10 w-24 h-8 bg-cyan-400/80 rotate-[-5deg] shadow-sm z-10" />
              <div className="absolute -top-4 right-5 sm:right-20 w-20 h-8 bg-yellow-400/80 rotate-[3deg] shadow-sm z-10" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 md:gap-y-12">

                {[
                  {
                    q: "А как выглядит журнал?",
                    title: "ОБЛОЖКА",
                    badge: "СТР. 2–5",
                    text: "Фото человека, его имя и номер выпуска — как в том самом журнале из детства.",
                    first: true,
                  },
                  {
                    q: "А что-то кроме фото?",
                    title: "ИГРЫ И ТЕСТЫ",
                    badge: "СТР. 6–7",
                    text: "Да-да, те самые игры и тесты, которые так интересно было решать на переменах или после уроков.",
                  },
                  {
                    q: "А комиксы есть? Без них не считается!",
                    title: "КОМИКС",
                    badge: "СТР. 8–11",
                    text: "Целый разворот комикса, где во главе всего — ваша история: как вы познакомились или что было потом.",
                  },
                  {
                    q: "А что-то кроме журнала?",
                    title: "СЕКРЕТНЫЙ ПОДАРОК ИЛИ НАКЛЕЙКИ",
                    badge: "СТР. 14–15",
                    text: "Лист наклеек — их можно оторвать и приклеить на тетрадь. Также за 300 рублей можно добавить секретную игрушку, все как в детстве.",
                    last: true,
                  },
                ].map((pair, i) => (
                  <div key={i} className="flex flex-col relative mt-4">

                    <div className="relative">
                      {pair.first && (
                        <span className="absolute -left-4 -top-5 bg-kiosk-pink text-white text-[10px] font-black px-2 py-0.5 border border-black -rotate-6 shadow-[2px_2px_0px_#000] z-20">
                          читай всплыв!
                        </span>
                      )}
                      {/* Голубые окошки — поменьше, наклон в разные стороны */}
                      <div className={`bubble-cyan px-4 py-2 font-bold text-sm md:text-base w-[85%] ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}>
                        {pair.q}
                      </div>
                    </div>

                    {/* Жёлтая карточка — наклон в противоположную сторону */}
                    <div className={`answer-card p-5 -mt-1 ml-4 w-[90%] relative ${i % 2 === 0 ? "rotate-[0.75deg]" : "-rotate-[0.75deg]"}`}>
                      <div className={`absolute -right-3 -top-3 w-11 h-11 bg-kiosk-pink rounded-full border-2 border-black flex items-center justify-center text-white text-[9px] font-black text-center leading-tight ${i % 2 === 0 ? "rotate-12" : "-rotate-12"}`}>
                        {pair.badge}
                      </div>

                      <h3 className="title-outline-pink font-alumni italic font-black text-xl mb-1 uppercase inline-block -skew-x-6">
                        {pair.title}
                      </h3>

                      <p className="text-sm font-medium">
                        {pair.text}
                      </p>

                      {pair.last && (
                        <div className="bg-[#ffe600] border-2 border-black px-3 py-1 text-xs font-black inline-block absolute -bottom-9 right-2 -rotate-2 shadow-[2px_2px_0px_#000]">
                          продолжение на стр. 12
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              </div>

              <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-center gap-6 border-t-2 border-dashed border-gray-400 pt-8">

                <p className="font-alumni italic font-black text-lg sm:text-xl md:text-2xl text-kiosk-yellow text-outline-purple text-center uppercase">
                  Хватит читать — пора делать свой номер!
                </p>

                <a
                  href="#form"
                  className="bg-kiosk-pink text-white font-alumni italic font-black text-base px-6 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all uppercase text-center"
                >
                  Заполнить анкету
                </a>

              </div>
            </div>
          </section>

          {/* 4. КАК ЗАКАЗАТЬ */}
          <section id="how">

            <h2 className="text-center text-3xl sm:text-5xl md:text-6xl font-alumni italic font-black text-outline-cyan mb-12 md:mb-16 uppercase">
              Как заказать свой номер?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {[
                {
                  num: 1,
                  title: "ВЫБЕРИ ПОВОД",
                  text: (
                    <>
                      <a href="#issues" className="font-black underline decoration-2 underline-offset-2 hover:bg-kiosk-yellow transition-colors px-0.5">
                        Classic
                      </a>{" "}
                      — журнал для любого повода,{" "}
                      <a href="#issues" className="font-black underline decoration-2 underline-offset-2 hover:bg-kiosk-yellow transition-colors px-0.5">
                        Happy birthday
                      </a>{" "}
                      — праздничная версия,{" "}
                      <a href="#issues" className="font-black underline decoration-2 underline-offset-2 hover:bg-kiosk-yellow transition-colors px-0.5">
                        To my love
                      </a>{" "}
                      — для второй половинки.
                    </>
                  ),
                  time: "1 мин",
                },
                {
                  num: 2,
                  title: "ЗАПОЛНИ АНКЕТУ",
                  text: "Ответь на вопросы о герое и загрузи фотографии.",
                  time: "10 мин",
                },
                {
                  num: 3,
                  title: "СОЗДАНИЕ НОМЕРА",
                  text: "Пишем тексты, создаём комикс и тесты, собираем обложку. И запускаем в печать.",
                  time: "5 дней",
                },
                {
                  num: 4,
                  title: "ДОСТАВКА",
                  text: "Доставим СДЭКОМ или ОЗОН в кратчайшие сроки. Оплачивается отдельно.",
                  time: "",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="bg-paper text-black p-6 pt-8 relative border-2 border-black shadow-[4px_4px_0px_#ff007f]"
                >

                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-kiosk-pink text-white rounded-full flex items-center justify-center font-montserrat font-black text-xl border-2 border-black">
                    {step.num}
                  </div>

                  {step.time && (
                    <div className="absolute top-3 right-3 bg-kiosk-cyan border-2 border-black px-2 py-0.5 text-[10px] font-black">
                      {step.time}
                    </div>
                  )}

                  <h3 className="font-alumni italic font-black text-lg mb-2 text-center">
                    {step.title}
                  </h3>

                  <p className="text-sm font-medium text-center">
                    {step.text}
                  </p>

                </div>
              ))}

            </div>
          </section>

          {/* 5. ЦЕНА */}
          <section id="price">

            <h2 className="text-center text-3xl sm:text-5xl md:text-6xl font-alumni italic font-black text-outline-cyan mb-3 uppercase">
              Цена
            </h2>

            <p className="text-center text-kiosk-cyan italic font-bold text-sm mb-10 md:mb-12">
              От чего зависит
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* КЛАССИК */}
              <div className="bg-[#f8c8dc] text-[#3a1524] p-6 sm:p-8 rounded-[2rem] flex flex-col h-full border-4 border-[#e59fb6] relative overflow-hidden">

                <img
                  src="/magazine-cover.jpg"
                  alt="Пример журнала Классик"
                  className="hidden sm:block absolute -right-6 -bottom-10 w-40 lg:w-44 rotate-[8deg] border-4 border-white shadow-[0_10px_25px_rgba(0,0,0,0.3)] pointer-events-none"
                />

                <div className="relative z-10 flex flex-col h-full sm:max-w-[62%]">
                  <h3 className="font-montserrat font-bold text-2xl mb-2 uppercase">
                    КЛАССИК
                  </h3>

                  <p className="text-sm font-medium mb-6">
                    Для любого повода: выпускной, 8 марта, 23 февраля, просто порадовать. В главной роли — человек и его увлечения.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#e59fb6]">
                      24–40 фото
                    </span>

                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#e59fb6]">
                      12 разворотов
                    </span>
                  </div>

                  <p className="font-montserrat font-black text-3xl mb-1 mt-auto">
                    от 3 000 руб.
                  </p>

                  <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-5">
                    В стоимость сразу входит печать
                  </p>

                  <a
                    href="#form"
                    className="w-max bg-white text-black font-alumni italic font-black text-sm uppercase px-6 py-2.5 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    Выбрать
                  </a>
                </div>

              </div>

              {/* ДЕНЬ РОЖДЕНИЯ */}
              <div className="bg-[#c0e8f9] text-[#1a3a4c] p-6 sm:p-8 rounded-[2rem] flex flex-col h-full border-4 border-[#8ad1ed] relative overflow-hidden">

                <img
                  src="/magazine2.png"
                  alt="Пример журнала Happy Birthday"
                  className="hidden sm:block absolute -right-6 -bottom-10 w-40 lg:w-44 -rotate-[8deg] border-4 border-white shadow-[0_10px_25px_rgba(0,0,0,0.3)] pointer-events-none"
                />

                <div className="absolute top-4 right-4 z-20 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white">
                  Хит
                </div>

                <div className="relative z-10 flex flex-col h-full sm:max-w-[62%]">
                  <h3 className="font-montserrat font-bold text-2xl mb-2 uppercase">
                    HAPPY BIRTHDAY
                  </h3>

                  <p className="text-sm font-medium mb-6">
                    Праздничная версия с поздравлением. Страница с тёплыми пожеланиями от близких, много совместных фотографий.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#8ad1ed]">
                      Больше фото
                    </span>

                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#8ad1ed]">
                      20 разворотов
                    </span>
                  </div>

                  <p className="font-montserrat font-black text-3xl mb-1 mt-auto">
                    от 3 000 руб.
                  </p>

                  <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-5">
                    В стоимость сразу входит печать
                  </p>

                  <a
                    href="#form"
                    className="w-max bg-white text-black font-alumni italic font-black text-sm uppercase px-6 py-2.5 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    Выбрать
                  </a>
                </div>

              </div>

              {/* TO MY LOVE */}
              <div className="bg-[#f9d8b6] text-[#4a2c16] p-6 sm:p-8 rounded-[2rem] flex flex-col h-full border-4 border-[#eab582] relative overflow-hidden">

                <img
                  src="/magazine3.jpg"
                  alt="Пример журнала To My Love"
                  className="hidden sm:block absolute -right-6 -bottom-10 w-40 lg:w-44 rotate-[8deg] border-4 border-white shadow-[0_10px_25px_rgba(0,0,0,0.3)] pointer-events-none"
                />

                <div className="relative z-10 flex flex-col h-full sm:max-w-[62%]">
                  <h3 className="font-montserrat font-bold text-2xl mb-2 uppercase">
                    TO MY LOVE
                  </h3>

                  <p className="text-sm font-medium mb-6">
                    Для второй половинки. Отдельная страница с романтичной запиской, гороскоп совместимости и много совместных фото.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#eab582]">
                      99–150 фото
                    </span>

                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-[#eab582]">
                      30 разворотов
                    </span>
                  </div>

                  <p className="font-montserrat font-black text-3xl mb-1 mt-auto">
                    от 3 000 руб.
                  </p>

                  <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-5">
                    В стоимость сразу входит печать
                  </p>

                  <a
                    href="#form"
                    className="w-max bg-white text-black font-alumni italic font-black text-sm uppercase px-6 py-2.5 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    Выбрать
                  </a>
                </div>

              </div>

            </div>

            {/* ДОПОЛНИТЕЛЬНО */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">

              <div className="bg-paper text-black p-5 sm:p-6 border-2 border-black shadow-[4px_4px_0px_#00e5ff]">
                <h4 className="font-alumni italic font-black text-lg mb-1 uppercase">
                  ДОСТАВКА — 500–1000 руб.
                </h4>
                <p className="text-sm font-medium">
                  Отправляем СДЭКом и ОЗОН-доставкой по всей России. Оплачивается отдельно.
                </p>
              </div>

              <div className="bg-paper text-black p-5 sm:p-6 border-2 border-black shadow-[4px_4px_0px_#ffe600]">
                <h4 className="font-alumni italic font-black text-lg mb-1 uppercase">
                  СЕКРЕТНЫЙ ПОДАРОК
                </h4>
                <p className="text-sm font-medium">
                  Игрушка или предмет из нашего детства в тему выпуска — как тогда, из киоска.
                </p>
              </div>

            </div>
          </section>

          {/* 6. ВЫПУСКИ */}
          <section id="issues">

            <h2 className="text-center text-3xl sm:text-5xl md:text-6xl font-alumni italic font-black text-outline-pink mb-3 uppercase">
              Наши выпуски
            </h2>

            <p className="text-center text-kiosk-cyan italic font-bold text-sm mb-10 md:mb-12 max-w-md mx-auto">
              Четыре номера, четыре человека, четыре повода плакать от нежности
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

              {[
                {
                  num: "№ 01",
                  month: "март",
                  color: "bg-kiosk-pink text-white",
                  star: "rotate-6",
                  cardRotate: "sm:-rotate-1",
                  image: "/issue-1.jpg",
                  chips: [
                    { text: "ТЕСТ: МЫ НА ЛЕТО?", color: "bg-kiosk-cyan text-black" },
                    { text: "КОМИКС: ТА САМАЯ ВСТРЕЧА", color: "bg-[#2a1245] text-white" },
                    { text: "12 ФАКТОВ О НЕЙ", color: "bg-kiosk-yellow text-black" },
                  ],
                  description: (
                    <>
                      <strong className="text-kiosk-pink">Выпуск про подругу.</strong> От подруги-подруги: «спасала на каждой второй странице».
                    </>
                  ),
                },
                {
                  num: "№ 02",
                  month: "апрель",
                  color: "bg-kiosk-cyan text-black",
                  star: "-rotate-6",
                  cardRotate: "sm:rotate-1",
                  image: "/issue-2.jpg",
                  chips: [
                    { text: "ОН И ЕГО ПЛЕЙЛИСТ", color: "bg-kiosk-pink text-white" },
                    { text: "НАША ХРОНОЛОГИЯ", color: "bg-[#2a1245] text-white" },
                    { text: "ШУТКА НА ПОЛЯХ", color: "bg-kiosk-cyan text-black" },
                  ],
                  description: (
                    <>
                      <strong className="text-kiosk-pink">Выпуск про парня.</strong> Два экземпляра: один — ему, второй — «на память».
                    </>
                  ),
                },
                {
                  num: "№ 03",
                  month: "май",
                  color: "bg-kiosk-yellow text-black",
                  star: "rotate-6",
                  cardRotate: "sm:-rotate-1",
                  image: "/issue-3.jpg",
                  chips: [
                    { text: "РЕЦЕПТ ЕЁ ПИРОГА", color: "bg-kiosk-yellow text-black" },
                    { text: "ПИСЬМО ДОЧЕРИ", color: "bg-[#2a1245] text-white" },
                    { text: "НАКЛЕЙКИ В ПОДАРОК", color: "bg-kiosk-pink text-white" },
                  ],
                  description: (
                    <>
                      <strong className="text-kiosk-pink">Выпуск про маму.</strong> Подарок на 8 Марта, который она поставила на самую верхнюю полку.
                    </>
                  ),
                },
                {
                  num: "№ 04",
                  month: "июнь",
                  color: "bg-kiosk-pink text-white",
                  star: "-rotate-6",
                  cardRotate: "sm:rotate-1",
                  image: "/issue-4.jpg",
                  chips: [
                    { text: "ДУЭТ ГОДА", color: "bg-kiosk-cyan text-black" },
                    { text: "МЕМЫ НА РАЗВОРОТЕ", color: "bg-[#2a1245] text-white" },
                    { text: "ЧТО БУДЕТ ДАЛЬШЕ", color: "bg-kiosk-yellow text-black" },
                  ],
                  description: (
                    <>
                      <strong className="text-kiosk-pink">Выпуск на двоих.</strong> Один номер, две обложки: переворачиваешь — другой герой.
                    </>
                  ),
                },
              ].map((issue, i) => (
                <div key={i} className={`flex flex-col min-w-0 ${issue.cardRotate} transition-transform hover:rotate-0`}>
                  <div className="bg-white border-2 border-black shadow-[5px_5px_0px_#ff007f] relative">

                    {/* Шапка журнала */}
                    <div className={`${issue.color} border-b-2 border-black px-3 py-1.5 flex items-center justify-between`}>
                      <span className="font-alumni italic font-black text-lg">КИОСК</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{issue.month}</span>
                    </div>

                    {/* Звёздочка с номером */}
                    <div className={`starburst-sm absolute -top-4 -right-3 ${issue.star} z-10`}>
                      {issue.num}
                    </div>

                    {/* Фото журнала — во всю ширину карточки */}
                    <div className="aspect-[3/5] overflow-hidden group">
                      <img
                        src={issue.image}
                        alt={`Выпуск ${issue.num} — ${issue.month}`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Чипы с содержимым */}
                    <div className="px-2 pt-2 space-y-1.5">
                      {issue.chips.map((chip, j) => (
                        <div key={j} className={`${chip.color} border-2 border-black px-2 py-1 text-[12px] font-alumni font-black uppercase leading-tight text-center`}>
                          {chip.text}
                        </div>
                      ))}
                    </div>

                    {/* Описание */}
                    <p className="px-3 py-3 text-[13px] font-medium text-black leading-snug">
                      {issue.description}
                    </p>

                  </div>
                </div>
              ))}

            </div>
          </section>

          {/* 7. АНКЕТА */}
          <section id="form" className="pt-6 md:pt-10">

            <div className="w-full max-w-4xl mx-auto text-center mb-8 md:mb-10">

              <h2 className="text-3xl sm:text-5xl md:text-7xl font-alumni italic font-black text-outline-pink uppercase mb-4">
                Анкета будущего номера
              </h2>

              <p className="text-white/70 text-sm sm:text-base italic font-bold">
                Пять коротких шагов — и у редакции появляется весь материал
              </p>

            </div>

            <MagazineForm
              initialParams={DEFAULT_PARAMS}
              onGenerate={handleGenerate}
              loading={navigating}
            />

          </section>

        </div>
      </div>

      {/* РАЗДЕЛИТЕЛЬ ИЗ ЛАМПОЧЕК */}
      <div className="dots-divider" aria-hidden="true" />

      {/* 8. ФУТЕР */}
      <footer className="border-t-2 border-white/10 bg-[#10051a] py-12 md:py-16 px-5 sm:px-6">

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">

          <div>

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-pink-500 bg-white flex items-center justify-center mb-6 shadow-[0_0_20px_#ff007f] overflow-hidden">
              <img
                src="/kiosk-logo.png"
                alt="Kiosk Logo"
                className="w-full h-full object-cover scale-[1.62]"
              />
            </div>

            <h3 className="text-4xl font-alumni italic font-black text-outline-pink mb-2 uppercase">
              КИОСК
            </h3>

            <p className="font-neucha text-kiosk-yellow text-xl">
              Печатаем чувства. Поштучно, на бумаге, с наклейками.
            </p>

          </div>

          <div>

            <h4 className="font-alumni italic font-black text-lg text-white mb-6 uppercase">
              В номере
            </h4>

            <ul className="space-y-4 font-alumni italic font-black text-base text-kiosk-pink">
              <li>
                <a href="#about" className="uppercase hover:underline">О бренде</a>
                <span className="block text-xs text-kiosk-cyan not-italic font-medium mt-0.5">зачем мы всё это</span>
              </li>
              <li>
                <a href="#inside" className="uppercase hover:underline">Что внутри</a>
                <span className="block text-xs text-kiosk-cyan not-italic font-medium mt-0.5">обложка · комикс · тест</span>
              </li>
              <li>
                <a href="#how" className="uppercase hover:underline">Как заказать</a>
                <span className="block text-xs text-kiosk-cyan not-italic font-medium mt-0.5">4 простых шага</span>
              </li>
              <li>
                <a href="#issues" className="uppercase hover:underline">Выпуски</a>
                <span className="block text-xs text-kiosk-cyan not-italic font-medium mt-0.5">примеры номеров</span>
              </li>
              <li>
                <a href="#form" className="uppercase hover:underline">Анкета</a>
                <span className="block text-xs text-kiosk-cyan not-italic font-medium mt-0.5">расскажи о герое</span>
              </li>
            </ul>

          </div>

          <div>

            <h4 className="font-alumni italic font-black text-lg text-white mb-6 uppercase">
              Связь
            </h4>

            <ul className="space-y-4 font-alumni italic font-black text-base text-kiosk-pink">
              <li>
                <a href="mailto:privet@kiosk-mag.nu" className="uppercase hover:underline">Почта</a>
                <span className="block text-white/80 font-medium mt-0.5">privet@kiosk-mag.nu</span>
              </li>
              <li>
                <a href="https://t.me/kiosk_mag" target="_blank" rel="noopener noreferrer" className="uppercase hover:underline">Телеграм</a>
                <span className="block text-white/80 font-medium mt-0.5">@kiosk_mag</span>
              </li>
              <li>
                <a href="#" className="uppercase hover:underline">Инстаграм</a>
                <span className="block text-white/80 font-medium mt-0.5">там же лежат наши макеты</span>
              </li>
              <li>
                <span className="uppercase">Киоск</span>
                <span className="block text-white/80 font-medium mt-0.5">Москва, у любимого метро, с 2026 года</span>
              </li>
            </ul>

          </div>

        </div>
      </footer>

    </main>
  );
}
