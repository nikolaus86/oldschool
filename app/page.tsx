"use client";

import { useState } from "react";
import Link from "next/link";
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
    <main className="min-h-screen font-inter">
      {/* ХЕДЕР */}
      <header className="sticky top-0 z-50 bg-[#1a0b2e]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#hero" className="w-12 h-12 rounded-full border-2 border-pink-500 bg-white/5 flex items-center justify-center font-montserrat italic font-black text-pink-500 text-xs">
            Kiosk
          </a>
          <nav className="hidden md:flex gap-6 font-montserrat italic font-bold text-sm uppercase">
            <a href="#hero" className="text-kiosk-yellow hover:text-white">Главная</a>
            <a href="#about" className="hover:text-kiosk-pink">Приветствие</a>
            <a href="#inside" className="hover:text-kiosk-pink">Что внутри</a>
            <a href="#how" className="hover:text-kiosk-pink">Как заказать</a>
            <a href="#issues" className="hover:text-kiosk-pink">Выпуски</a>
            <a href="#form" className="hover:text-kiosk-pink">Анкета</a>
          </nav>
          <a href="#form" className="md:hidden bg-kiosk-pink text-white px-4 py-2 rounded-full font-bold text-xs">
            Создать
          </a>
        </div>
      </header>

      {/* 1. HERO */}
      <section id="hero" className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 relative">
        <div className="flex-1 z-10">
          <div className="inline-block bg-kiosk-pink text-white font-bold text-sm px-4 py-1.5 mb-6 -rotate-2 shadow-[3px_3px_0px_#000]">
            СПЕЦИАЛЬНЫЙ ВЫПУСК О ТЕБЕ
          </div>
          <h1 className="text-7xl md:text-9xl font-montserrat italic font-black text-outline uppercase leading-none mb-6">
            КИОСК
          </h1>
          <p className="text-xl md:text-2xl text-kiosk-yellow font-montserrat italic font-bold mb-6">
            журнал, которого не было ни в одном киоске
          </p>
          <p className="text-white/80 max-w-lg mb-8 text-lg">
            Помнишь, как выбирал журналы у дома? Мы вернули это чувство — только теперь каждый номер посвящен твоему человеку: обложка с его лицом, письмо от редактора, комикс, тесты и лист стикеров внутри.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#form"
              className="bg-kiosk-pink text-white font-black text-lg px-8 py-3 rounded-full border-2 border-white shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all"
            >
              СОБРАТЬ СВОЙ ВЫПУСК
            </a>
            <a
              href="#issues"
              className="bg-transparent text-white font-black text-lg px-8 py-3 rounded-full border-2 border-white hover:bg-white/10 transition-all inline-block text-center"
            >
              ПОСМОТРЕТЬ НОМЕРА
            </a>
          </div>
        </div>
        
        {/* Место под аниме-девочку */}
        <div className="flex-1 relative hidden md:flex justify-center items-center">
          <div className="relative w-full max-w-sm flex justify-center">
  <img
    src="/girl.png"
    alt="Персонаж на обложке"
    className="w-full h-auto drop-shadow-[0_0_40px_rgba(255,0,127,0.6)]"
  />
  <div className="absolute top-10 right-0 bg-[#1a0b2e] border border-pink-500/50 p-4 rounded text-xs font-bold text-kiosk-yellow shadow-lg rotate-3">
    № 001<br/>ВЕСНА 2026<br/>ТИРАЖ: 1 ШТ.
  </div>
</div>
        </div>
      </section>

      {/* 2. ПРИВЕТСТВИЕ */}
      <section id="about" className="bg-[#140822] py-20 px-4 relative">
        <div className="max-w-5xl mx-auto bg-paper text-black p-8 md:p-12 shadow-[10px_10px_0px_#ff007f] rotate-1">
          <h2 className="text-4xl md:text-5xl font-montserrat italic font-black text-kiosk-purple uppercase mb-6 -rotate-1">
            Мы вернули те самые журналы
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg">
            <div className="space-y-4">
              <p>В детстве всё важное было на бумаге: обложка с обладателем премии, вкладыш с наклейками, страница с тестом, который решал, кем тебе быть в этом месяце.</p>
              <p className="font-bold">Выбирать журнал у киоска было целым событием — ты держал его в руках, листал прямо у стенки и уносил домой.</p>
              <p>Мы сделали «Киоск» из тоски по этим ощущениям. Только теперь на обложке — не дальная звезда, а твой одногруппник, твоя сестра или человек, с которым у вас своя история.</p>
              <p className="font-neucha text-2xl text-kiosk-pink mt-6">бумага, клей, ножницы и очень много любви</p>
            </div>
            <div className="flex flex-col justify-center items-center bg-white p-4 shadow-xl border border-gray-200">
  <img
    src="/magazine.png"
    alt="Пример журнала"
    className="w-full h-auto object-contain mb-4"
  />
  <div className="bg-yellow-200 p-4 w-full font-bold text-center border border-black rotate-2">
    «Каждый номер печатается в одном экземпляре — второго такого не будет»
  </div>
</div>
          </div>
        </div>
      </section>

      {/* 3. ЧТО ВНУТРИ */}
      <section id="inside" className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-center text-4xl md:text-6xl font-montserrat italic font-black text-outline-cyan mb-4 uppercase">
          Что внутри журнала
        </h2>
        <p className="text-center text-white/60 mb-12 italic">Открываешь наугад — и начинается овалют...</p>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "ОБЛОЖКА", text: "Фото твоего человека, его имя и номер выпуска — как в том самом журнале из детства.", color: "bg-kiosk-yellow", rotate: "-rotate-1" },
            { title: "ПИСЬМО РЕДАКТОРА", text: "Для попсов и о том, почему мы снова делаем бумагу, и что в ней важнее экрана.", color: "bg-kiosk-yellow", rotate: "rotate-1" },
            { title: "КОМИКС", text: "Четыре полосы, где главный герой — ваша история: как вы познакомились и что было потом.", color: "bg-kiosk-yellow", rotate: "rotate-2" },
            { title: "ТЕСТ", text: "«Кто ты: партнёр по кино-вечерам?» — с ответами на полях и вердиктом редакции.", color: "bg-kiosk-yellow", rotate: "-rotate-2" },
            { title: "ФАКТЫ И СТИКЕРЫ", text: "Десять фактов о вашем человеке и лист наклеек — их можно оторвать и приклеить на тетрадь.", color: "bg-kiosk-yellow", rotate: "rotate-1", full: true },
          ].map((item, i) => (
            <div key={i} className={`${item.color} ${item.rotate} ${item.full ? "md:col-span-2" : ""} p-6 md:p-8 sticker relative`}>
              <div className="absolute -top-4 -left-2 bg-kiosk-cyan text-black text-xs font-bold px-3 py-1 border border-black rotate-[-5deg]">
                {i % 2 === 0 ? "А что там вообще внутри?" : "А кто это всё придумал?"}
              </div>
              <h3 className="text-2xl font-montserrat italic font-black text-kiosk-pink mb-2">{item.title}</h3>
              <p className="text-black font-medium text-lg">{item.text}</p>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-kiosk-pink rounded-full border-2 border-black flex items-center justify-center font-bold text-white text-xs rotate-12">
                СТР {i + 3}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. КАК ЗАКАЗАТЬ */}
      <section id="how" className="bg-[#140822] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-montserrat italic font-black text-outline mb-12 uppercase">
            Как заказать свой номер
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: 1, title: "ВЫБЕРИ ГЕРОЯ", text: "Партнёр, мама, подруга или кот — тот, кто вдохновляет." },
              { num: 2, title: "РАССКАЖИ О НЁМ", text: "Заполнишь анкету: увлечения, ваши истории, любимые шутки и фото." },
              { num: 3, title: "МЫ СДЕЛАЕМ НОМЕР", text: "Пишем тексты, рисуем комикс, собираем обложку." },
              { num: 4, title: "ЗАБИРАЙ И ДАРИ", text: "Через 7 дней курьер звонит в дверь — и ты вручаешь бумажный шедевр." },
            ].map((step) => (
              <div key={step.num} className="bg-paper text-black p-6 relative border-2 border-black shadow-[4px_4px_0px_#ff007f]">
                <div className="absolute -top-5 -left-4 w-12 h-12 bg-kiosk-pink text-white rounded-full flex items-center justify-center font-montserrat font-black text-2xl border-2 border-black shadow-md">
                  {step.num}
                </div>
                <h3 className="font-montserrat italic font-black text-xl mt-4 mb-2">{step.title}</h3>
                <p className="text-sm font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ВЫПУСКИ */}
      <section id="issues" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-center text-4xl md:text-5xl font-montserrat italic font-black text-outline-cyan mb-4 uppercase">
          Наши выпуски
        </h2>
        <p className="text-center text-white/60 mb-12">Четыре номера, четыре человека, четыре повода плакать от нежности</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "КИОСК", theme: "МАЙ", color: "bg-pink-500", title: "ТЕСТ: МЫ НА ЛЕТО?", subtitle: "КОМИКС: ТА САМАЯ ВСТРЕЧА" },
            { name: "КИОСК", theme: "АПРЕЛЬ", color: "bg-cyan-500", title: "ОН И ЕГО ПЛЕЙЛИСТ", subtitle: "ГДЕ Я ХОЧУ ОТДОХНУТЬ" },
            { name: "КИОСК", theme: "МАЙ", color: "bg-yellow-500", title: "РЕЦЕПТ ЕЁ ПИРОГА", subtitle: "ПИСЬМО ДОЧЕРИ" },
            { name: "КИОСК", theme: "ИЮНЬ", color: "bg-pink-500", title: "ДВОЕ ГОДА", subtitle: "МЕЖДУ НА РАЗВОРОТЕ" },
          ].map((issue, i) => (
            <div key={i} className="relative group">
              <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden relative border-2 border-white/20">
  <img
    src={`/issue-${i + 1}.jpg`}
    alt={`Выпуск ${issue.theme}`}
    className="absolute inset-0 w-full h-full object-cover z-0"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
  <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
    <h3 className="font-montserrat italic font-black text-2xl text-white drop-shadow-md">{issue.name}</h3>
    <div className={`${issue.color} text-black text-[10px] font-bold px-2 py-1 rounded-sm rotate-3`}>
      {issue.theme} · №0{i + 1}
    </div>
  </div>
</div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="bg-white text-black font-bold text-xs px-2 py-1 w-max">{issue.title}</div>
                <div className="bg-white text-black font-bold text-xs px-2 py-1 w-max">{issue.subtitle}</div>
                <p className="text-xs text-white/50 leading-tight mt-2">Выпуск про подругу. От подруги: подруги; плакала на каждой странице.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. АНКЕТА (Форма внизу страницы, как в Figma) */}
      <section id="form" className="py-20 px-4 bg-[#140822]">
        <div className="w-full max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-montserrat italic font-black text-outline uppercase mb-2">
            АНКЕТА БУДУЩЕГО НОМЕРА
          </h2>
          <p className="text-white/70 italic">Пять коротких шагов — и у редакции появляется весь материал</p>
        </div>

        {/* Лист бумаги */}
        <div className="w-full max-w-3xl mx-auto bg-grid-paper text-black p-6 md:p-10 shadow-[10px_10px_0px_#ff007f] relative border-4 border-gray-300 rotate-1">
          {/* Декоративный скотч сверху */}
          <div className="absolute -top-4 left-10 w-24 h-8 bg-cyan-400/80 rotate-[-5deg] shadow-sm z-10" />
          <div className="absolute -top-4 right-20 w-20 h-8 bg-yellow-400/80 rotate-[3deg] shadow-sm z-10" />

          <div className="mb-8 border-2 border-black rounded-full overflow-hidden h-6 relative bg-white">
            <div className="absolute top-0 left-0 h-full bg-kiosk-pink w-1/3" />
            <p className="absolute inset-0 text-center text-xs font-bold leading-5 z-10 uppercase">ШАГ 1 ИЗ 5 — ГЕРОЙ</p>
          </div>

          {/* Компонент формы */}
          <MagazineForm
            initialParams={DEFAULT_PARAMS}
            onGenerate={handleGenerate}
            loading={navigating}
          />
        </div>
      </section>

      {/* 7. ФУТЕР */}
      <footer className="border-t border-white/10 bg-black/40 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="w-16 h-16 rounded-full border-2 border-pink-500 bg-white/5 flex items-center justify-center font-montserrat italic font-black text-pink-500 mb-4">
              Kiosk
            </div>
            <p className="font-neucha text-kiosk-yellow text-xl max-w-xs">
              Печатаем чувства. Поштучно, на бумаге, с наклейками.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white/50 mb-2 uppercase tracking-wider text-xs">В номере</span>
              <a href="#about" className="text-kiosk-pink font-bold hover:underline">О бренде</a>
              <a href="#inside" className="text-kiosk-pink font-bold hover:underline">Что внутри</a>
              <a href="#how" className="text-kiosk-pink font-bold hover:underline">Как заказать</a>
              <a href="#issues" className="text-kiosk-pink font-bold hover:underline">Выпуски</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white/50 mb-2 uppercase tracking-wider text-xs">Связь</span>
              <a href="mailto:privet@kiosk-mag.ru" className="text-kiosk-pink font-bold hover:underline">privet@kiosk-mag.ru</a>
              <a href="#" className="text-kiosk-pink font-bold hover:underline">@kiosk_mag</a>
              <span className="text-white/40 text-xs mt-2">Москва, у любимого метро, с 2026 года</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}