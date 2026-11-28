"use client";

import { useState, useEffect, useCallback } from "react";

type OrderStatus = "new" | "accepted" | "rejected";

const STATUS_META: Record<OrderStatus, { label: string; badge: string }> = {
  new: { label: "Новый", badge: "bg-kiosk-cyan text-black" },
  accepted: { label: "В работе", badge: "bg-green-400 text-black" },
  rejected: { label: "Отклонён", badge: "bg-red-400 text-black" },
};

const FILTERS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые" },
  { key: "accepted", label: "В работе" },
  { key: "rejected", label: "Отклонённые" },
];

// Как показывать поля анкеты в модалке
const FIELD_LABELS: Record<string, string> = {
  relation: "Кто он тебе",
  pseudonym: "Как к нему обращаться",
  heroBirthdate: "Дата рождения",
  giverType: "Посланник подарка",
  universes: "Вселенные",
  city: "Город",
  favoriteCharacter: "Любимый персонаж",
  favoriteColor: "Любимый цвет",
  pet: "Питомец",
  uniqueness: "Что в нём особенного",
  qualities: "Качества",
  favoriteFood: "Любимая еда / напиток",
  favoritePlace: "Любимое место",
  favoriteSeason: "Любимое время года",
  favoriteHobby: "Любимое хобби",
  personalLetter: "Письмо герою",
  testType: "Тип теста",
  testTopic: "Тема теста",
  games: "Игры",
  gamePersonal: "Личные детали в играх",
  gameDetails: "Детали для игр",
  story: "История для комикса",
  playlist: "Плейлист (5 треков)",
  cinema: "Кино (5 фильмов)",
  styleNote: "Стиль и образ",
  attributes: "Личные атрибуты",
  interviewQuestions: "Вопросы для интервью",
  wishes: "Пожелания (wishes)",
};

const VALUE_FORMATTERS: Record<string, (v: any) => string> = {
  giverType: (v) => (v === "self" ? "От себя" : v === "friends" ? "От компании / друзей" : v || "—"),
  portraitType: (v) => (v === "world" ? "«Маленький мир героя»" : "«Письмо тебе»"),
  testType: (v) => (v === "points" ? "С баллами" : v === "arrows" ? "«Стрелочки»" : v || "—"),
  gamePersonal: (v) => (v === "yes" ? "Да, с личными деталями" : "Нет, универсальные"),
  imageType: (v) =>
    ({
      playlist: "Плейлист",
      cinema: "Кино",
      style: "Стиль и образ",
      attributes: "Личные атрибуты",
    } as Record<string, string>)[v] || v || "—",
};

const PHOTO_SECTIONS: { key: string; label: string }[] = [
  { key: "heroPhoto", label: "Фото для обложки" },
  { key: "extraPhotos", label: "Любимые / детские фото" },
  { key: "portraitPhotos", label: "Фото из «Портрета»" },
  { key: "memoryPhotos", label: "Памятные фото" },
];

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [openingId, setOpeningId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // light=1 — без base64-фото, список грузится быстро
      const res = await fetch("/api/orders?light=1");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuth) fetchOrders();
  }, [isAuth, fetchOrders]);

  // Вход
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      setIsAuth(true);
    } else {
      alert("Неверный пароль (подсказка: admin)");
    }
  };

  // Принять / отклонить заказ
  const setOrderStatus = async (id: number, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Не удалось обновить статус");
      }

      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setSelectedOrder((prev: any) => (prev && prev.id === id ? { ...prev, status } : prev));
    } catch (e: any) {
      alert(e.message || "Ошибка обновления статуса");
    } finally {
      setUpdatingId(null);
    }
  };

  // Открыть полную анкету (с фото)
  const openOrder = async (id: number) => {
    setOpeningId(id);
    try {
      const res = await fetch(`/api/orders?id=${id}`);
      const data = await res.json();
      setSelectedOrder(data);
    } catch (e) {
      console.error(e);
      alert("Не удалось загрузить анкету");
    } finally {
      setOpeningId(null);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0b2e] p-4 text-white">
        <form onSubmit={handleLogin} className="bg-grid-paper text-black p-8 rounded-lg shadow-[8px_8px_0px_#ff007f] max-w-sm w-full border-4 border-black rotate-1">
          <h1 className="text-3xl font-montserrat italic font-black uppercase text-center mb-6">Вход в редакцию</h1>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-400 rounded bg-white/50 mb-4 focus:outline-none focus:border-kiosk-pink"
          />
          <button type="submit" className="w-full bg-kiosk-pink text-white font-bold py-2 rounded border-2 border-black shadow-[3px_3px_0px_#000] uppercase">
            Войти
          </button>
        </form>
      </div>
    );
  }

  const counts = {
    all: orders.length,
    new: orders.filter((o) => (o.status || "new") === "new").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
  };

  const visibleOrders = filter === "all" ? orders : orders.filter((o) => (o.status || "new") === filter);

  const StatusBadge = ({ status }: { status: OrderStatus }) => (
    <span className={`${STATUS_META[status].badge} text-[10px] font-bold px-2 py-1 border border-black uppercase`}>
      {STATUS_META[status].label}
    </span>
  );

  const ActionButtons = ({ order, compact = false }: { order: any; compact?: boolean }) => {
    const status: OrderStatus = order.status || "new";
    const busy = updatingId === order.id;

    return (
      <div className={`${compact ? "" : "mt-auto"}`}>
        <div className={`flex gap-3 ${compact ? "" : ""}`}>
          <button
            onClick={() => setOrderStatus(order.id, "accepted")}
            disabled={busy || status === "accepted"}
            className={`flex-1 font-bold py-2 rounded border-2 border-black uppercase text-xs transition ${
              status === "accepted"
                ? "bg-green-400 cursor-default"
                : "bg-green-400/90 hover:bg-green-400 shadow-[3px_3px_0px_#000] hover:translate-y-0.5 hover:shadow-none"
            } disabled:opacity-60`}
          >
            {busy ? "..." : "Принять"}
          </button>
          <button
            onClick={() => setOrderStatus(order.id, "rejected")}
            disabled={busy || status === "rejected"}
            className={`flex-1 font-bold py-2 rounded border-2 border-black uppercase text-xs transition ${
              status === "rejected"
                ? "bg-red-400 cursor-default"
                : "bg-gray-200 hover:bg-red-300"
            } disabled:opacity-60`}
          >
            Отклонить
          </button>
        </div>
        {status !== "new" && (
          <button
            onClick={() => setOrderStatus(order.id, "new")}
            disabled={busy}
            className="w-full mt-2 text-[11px] font-bold text-gray-500 hover:text-black uppercase underline underline-offset-2 disabled:opacity-50"
          >
            ↺ Вернуть в новые
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white p-6 md:p-12 font-inter">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8 border-b-2 border-white/20 pb-4">
          <h1 className="text-4xl font-montserrat italic font-black text-kiosk-yellow uppercase">Панель редакции</h1>
          <div className="flex gap-4 items-center">
            <button onClick={fetchOrders} className="text-sm font-bold text-kiosk-cyan hover:underline">
              ⟳ Обновить
            </button>
            <button onClick={() => setIsAuth(false)} className="text-sm font-bold text-white/50 hover:text-white">Выйти</button>
          </div>
        </div>

        {/* Фильтры по статусам */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border-2 transition ${
                filter === f.key
                  ? "bg-kiosk-pink text-white border-black shadow-[3px_3px_0px_#000]"
                  : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
              }`}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-white/50 animate-pulse py-16">Загрузка заказов...</p>
        ) : visibleOrders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
            <p className="text-xl font-bold text-white/50">
              {filter === "all" ? "Пока нет новых заказов" : "В этой категории пусто"}
            </p>
            <p className="text-sm text-white/30 mt-2">Заполните анкету на главной странице, чтобы проверить работу.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleOrders.map((order) => {
              const status: OrderStatus = order.status || "new";
              return (
                <div
                  key={order.id}
                  className={`bg-white text-black p-5 rounded-lg border-4 border-black shadow-[5px_5px_0px_#ff007f] relative flex flex-col ${
                    status === "rejected" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <span className="bg-kiosk-cyan text-black text-[10px] font-bold px-2 py-1 border border-black">{order.date}</span>
                    <StatusBadge status={status} />
                  </div>

                  <h2 className="text-2xl font-montserrat italic font-black uppercase mb-1">
                    {order.heroName || "Без имени"}
                  </h2>
                  <p className="text-sm font-bold text-gray-600 mb-3">
                    Выпуск: {order.issue || "Не указан"}
                  </p>

                  <div className="space-y-1 text-xs mb-4">
                    <p><strong>Кто он тебе:</strong> {order.relation || "—"}</p>
                    <p><strong>Вселенные:</strong> {order.universes?.join(", ") || "Нет"}</p>
                    <p><strong>Подарок от:</strong> {order.giverType === "self" ? "Себя" : "Друзей"}</p>
                  </div>

                  {status !== "new" && (
                    <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase">
                      Анкета обработана
                    </p>
                  )}

                  <button
                    onClick={() => openOrder(order.id)}
                    disabled={openingId === order.id}
                    className="w-full bg-black text-white text-xs font-bold py-2 rounded uppercase hover:bg-gray-800 transition mb-3 disabled:opacity-50"
                  >
                    {openingId === order.id ? "Загрузка..." : "Открыть всю анкету"}
                  </button>

                  <ActionButtons order={order} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Модалка с полной анкетой */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white text-black p-6 md:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-black shadow-[10px_10px_0px_#00e5ff]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2 border-b-2 border-gray-300 pb-2">
              <h2 className="text-2xl md:text-3xl font-montserrat italic font-black uppercase text-kiosk-pink">
                Анкета: {selectedOrder.heroName || "без имени"}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black font-black text-xl">✕</button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-gray-500">{selectedOrder.date}</span>
              <StatusBadge status={selectedOrder.status || "new"} />
            </div>

            {/* Поля анкеты */}
            <div className="space-y-2 text-sm">
              {Object.entries(FIELD_LABELS).map(([key, label]) => {
                const value = selectedOrder[key];
                if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return null;

                const formatter = VALUE_FORMATTERS[key];
                const display = formatter
                  ? formatter(value)
                  : Array.isArray(value)
                    ? value.join(", ")
                    : String(value);

                return (
                  <div key={key} className="bg-gray-100 p-3 rounded">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
                    <p className="font-medium whitespace-pre-wrap">{display}</p>
                  </div>
                );
              })}
            </div>

            {/* Фото */}
            {PHOTO_SECTIONS.map(({ key, label }) => {
              const value = selectedOrder[key];
              const photos = Array.isArray(value) ? value : value ? [value] : [];
              if (photos.length === 0) return null;

              return (
                <div key={key} className="mt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {photos.map((src: string, i: number) => (
                      <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                        <img
                          src={src}
                          alt={`${label} — ${i + 1}`}
                          className="w-20 h-20 object-cover border-2 border-black rounded hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Действия */}
            <div className="mt-8 flex gap-4">
              <ActionButtons order={selectedOrder} compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
