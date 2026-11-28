"use client";

import { useState, useEffect, useCallback } from "react";

type OrderStatus = "new" | "accepted" | "rejected";

const STATUS_META: Record<OrderStatus, { label: string; badge: string }> = {
  new: { label: "РќРѕРІС‹Р№", badge: "bg-kiosk-cyan text-black" },
  accepted: { label: "Р’ СЂР°Р±РѕС‚Рµ", badge: "bg-green-400 text-black" },
  rejected: { label: "РћС‚РєР»РѕРЅС‘РЅ", badge: "bg-red-400 text-black" },
};

const FILTERS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "Р’СЃРµ" },
  { key: "new", label: "РќРѕРІС‹Рµ" },
  { key: "accepted", label: "Р’ СЂР°Р±РѕС‚Рµ" },
  { key: "rejected", label: "РћС‚РєР»РѕРЅС‘РЅРЅС‹Рµ" },
];

// РљР°Рє РїРѕРєР°Р·С‹РІР°С‚СЊ РїРѕР»СЏ Р°РЅРєРµС‚С‹ РІ РјРѕРґР°Р»РєРµ
const FIELD_LABELS: Record<string, string> = {
  relation: "РљС‚Рѕ РѕРЅ С‚РµР±Рµ",
  pseudonym: "РљР°Рє Рє РЅРµРјСѓ РѕР±СЂР°С‰Р°С‚СЊСЃСЏ",
  heroBirthdate: "Р”Р°С‚Р° СЂРѕР¶РґРµРЅРёСЏ",
  giverType: "РџРѕСЃР»Р°РЅРЅРёРє РїРѕРґР°СЂРєР°",
  universes: "Р’СЃРµР»РµРЅРЅС‹Рµ",
  city: "Р“РѕСЂРѕРґ",
  favoriteCharacter: "Р›СЋР±РёРјС‹Р№ РїРµСЂСЃРѕРЅР°Р¶",
  favoriteColor: "Р›СЋР±РёРјС‹Р№ С†РІРµС‚",
  pet: "РџРёС‚РѕРјРµС†",
  uniqueness: "Р§С‚Рѕ РІ РЅС‘Рј РѕСЃРѕР±РµРЅРЅРѕРіРѕ",
  qualities: "РљР°С‡РµСЃС‚РІР°",
  favoriteFood: "Р›СЋР±РёРјР°СЏ РµРґР° / РЅР°РїРёС‚РѕРє",
  favoritePlace: "Р›СЋР±РёРјРѕРµ РјРµСЃС‚Рѕ",
  favoriteSeason: "Р›СЋР±РёРјРѕРµ РІСЂРµРјСЏ РіРѕРґР°",
  favoriteHobby: "Р›СЋР±РёРјРѕРµ С…РѕР±Р±Рё",
  personalLetter: "РџРёСЃСЊРјРѕ РіРµСЂРѕСЋ",
  testType: "РўРёРї С‚РµСЃС‚Р°",
  testTopic: "РўРµРјР° С‚РµСЃС‚Р°",
  games: "РРіСЂС‹",
  gamePersonal: "Р›РёС‡РЅС‹Рµ РґРµС‚Р°Р»Рё РІ РёРіСЂР°С…",
  gameDetails: "Р”РµС‚Р°Р»Рё РґР»СЏ РёРіСЂ",
  story: "РСЃС‚РѕСЂРёСЏ РґР»СЏ РєРѕРјРёРєСЃР°",
  playlist: "РџР»РµР№Р»РёСЃС‚ (5 С‚СЂРµРєРѕРІ)",
  cinema: "РљРёРЅРѕ (5 С„РёР»СЊРјРѕРІ)",
  styleNote: "РЎС‚РёР»СЊ Рё РѕР±СЂР°Р·",
  attributes: "Р›РёС‡РЅС‹Рµ Р°С‚СЂРёР±СѓС‚С‹",
  interviewQuestions: "Р’РѕРїСЂРѕСЃС‹ РґР»СЏ РёРЅС‚РµСЂРІСЊСЋ",
  wishes: "РџРѕР¶РµР»Р°РЅРёСЏ (wishes)",
};

const VALUE_FORMATTERS: Record<string, (v: any) => string> = {
  giverType: (v) => (v === "self" ? "РћС‚ СЃРµР±СЏ" : v === "friends" ? "РћС‚ РєРѕРјРїР°РЅРёРё / РґСЂСѓР·РµР№" : v || "вЂ”"),
  portraitType: (v) => (v === "world" ? "В«РњР°Р»РµРЅСЊРєРёР№ РјРёСЂ РіРµСЂРѕСЏВ»" : "В«РџРёСЃСЊРјРѕ С‚РµР±РµВ»"),
  testType: (v) => (v === "points" ? "РЎ Р±Р°Р»Р»Р°РјРё" : v === "arrows" ? "В«РЎС‚СЂРµР»РѕС‡РєРёВ»" : v || "вЂ”"),
  gamePersonal: (v) => (v === "yes" ? "Р”Р°, СЃ Р»РёС‡РЅС‹РјРё РґРµС‚Р°Р»СЏРјРё" : "РќРµС‚, СѓРЅРёРІРµСЂСЃР°Р»СЊРЅС‹Рµ"),
  imageType: (v) =>
    ({
      playlist: "РџР»РµР№Р»РёСЃС‚",
      cinema: "РљРёРЅРѕ",
      style: "РЎС‚РёР»СЊ Рё РѕР±СЂР°Р·",
      attributes: "Р›РёС‡РЅС‹Рµ Р°С‚СЂРёР±СѓС‚С‹",
    } as Record<string, string>)[v] || v || "вЂ”",
};

const PHOTO_SECTIONS: { key: string; label: string }[] = [
  { key: "heroPhoto", label: "Р¤РѕС‚Рѕ РґР»СЏ РѕР±Р»РѕР¶РєРё" },
  { key: "extraPhotos", label: "Р›СЋР±РёРјС‹Рµ / РґРµС‚СЃРєРёРµ С„РѕС‚Рѕ" },
  { key: "portraitPhotos", label: "Р¤РѕС‚Рѕ РёР· В«РџРѕСЂС‚СЂРµС‚Р°В»" },
  { key: "memoryPhotos", label: "РџР°РјСЏС‚РЅС‹Рµ С„РѕС‚Рѕ" },
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
      // light=1 вЂ” Р±РµР· base64-С„РѕС‚Рѕ, СЃРїРёСЃРѕРє РіСЂСѓР·РёС‚СЃСЏ Р±С‹СЃС‚СЂРѕ
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

  // Р’С…РѕРґ
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      setIsAuth(true);
    } else {
      alert("РќРµРІРµСЂРЅС‹Р№ РїР°СЂРѕР»СЊ (РїРѕРґСЃРєР°Р·РєР°: admin)");
    }
  };

  // РџСЂРёРЅСЏС‚СЊ / РѕС‚РєР»РѕРЅРёС‚СЊ Р·Р°РєР°Р·
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
        throw new Error(err.error || "РќРµ СѓРґР°Р»РѕСЃСЊ РѕР±РЅРѕРІРёС‚СЊ СЃС‚Р°С‚СѓСЃ");
      }

      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setSelectedOrder((prev: any) => (prev && prev.id === id ? { ...prev, status } : prev));
    } catch (e: any) {
      alert(e.message || "РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ СЃС‚Р°С‚СѓСЃР°");
    } finally {
      setUpdatingId(null);
    }
  };

  // РћС‚РєСЂС‹С‚СЊ РїРѕР»РЅСѓСЋ Р°РЅРєРµС‚Сѓ (СЃ С„РѕС‚Рѕ)
  const openOrder = async (id: number) => {
    setOpeningId(id);
    try {
      const res = await fetch(`/api/orders?id=${id}`);
      const data = await res.json();
      setSelectedOrder(data);
    } catch (e) {
      console.error(e);
      alert("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ Р°РЅРєРµС‚Сѓ");
    } finally {
      setOpeningId(null);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0b2e] p-4 text-white">
        <form onSubmit={handleLogin} className="bg-grid-paper text-black p-8 rounded-lg shadow-[8px_8px_0px_#ff007f] max-w-sm w-full border-4 border-black rotate-1">
          <h1 className="text-3xl font-montserrat italic font-black uppercase text-center mb-6">Р’С…РѕРґ РІ СЂРµРґР°РєС†РёСЋ</h1>
          <input
            type="password"
            placeholder="РџР°СЂРѕР»СЊ"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-400 rounded bg-white/50 mb-4 focus:outline-none focus:border-kiosk-pink"
          />
          <button type="submit" className="w-full bg-kiosk-pink text-white font-bold py-2 rounded border-2 border-black shadow-[3px_3px_0px_#000] uppercase">
            Р’РѕР№С‚Рё
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
            {busy ? "..." : "РџСЂРёРЅСЏС‚СЊ"}
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
            РћС‚РєР»РѕРЅРёС‚СЊ
          </button>
        </div>
        {status !== "new" && (
          <button
            onClick={() => setOrderStatus(order.id, "new")}
            disabled={busy}
            className="w-full mt-2 text-[11px] font-bold text-gray-500 hover:text-black uppercase underline underline-offset-2 disabled:opacity-50"
          >
            в†є Р’РµСЂРЅСѓС‚СЊ РІ РЅРѕРІС‹Рµ
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white p-6 md:p-12 font-inter">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8 border-b-2 border-white/20 pb-4">
          <h1 className="text-4xl font-montserrat italic font-black text-kiosk-yellow uppercase">РџР°РЅРµР»СЊ СЂРµРґР°РєС†РёРё</h1>
          <div className="flex gap-4 items-center">
            <button onClick={fetchOrders} className="text-sm font-bold text-kiosk-cyan hover:underline">
              вџі РћР±РЅРѕРІРёС‚СЊ
            </button>
            <button onClick={() => setIsAuth(false)} className="text-sm font-bold text-white/50 hover:text-white">Р’С‹Р№С‚Рё</button>
          </div>
        </div>

        {/* Р¤РёР»СЊС‚СЂС‹ РїРѕ СЃС‚Р°С‚СѓСЃР°Рј */}
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
          <p className="text-center text-white/50 animate-pulse py-16">Р—Р°РіСЂСѓР·РєР° Р·Р°РєР°Р·РѕРІ...</p>
        ) : visibleOrders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
            <p className="text-xl font-bold text-white/50">
              {filter === "all" ? "РџРѕРєР° РЅРµС‚ РЅРѕРІС‹С… Р·Р°РєР°Р·РѕРІ" : "Р’ СЌС‚РѕР№ РєР°С‚РµРіРѕСЂРёРё РїСѓСЃС‚Рѕ"}
            </p>
            <p className="text-sm text-white/30 mt-2">Р—Р°РїРѕР»РЅРёС‚Рµ Р°РЅРєРµС‚Сѓ РЅР° РіР»Р°РІРЅРѕР№ СЃС‚СЂР°РЅРёС†Рµ, С‡С‚РѕР±С‹ РїСЂРѕРІРµСЂРёС‚СЊ СЂР°Р±РѕС‚Сѓ.</p>
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
                    {order.heroName || "Р‘РµР· РёРјРµРЅРё"}
                  </h2>
                  <p className="text-sm font-bold text-gray-600 mb-3">
                    Р’С‹РїСѓСЃРє: {order.issue || "РќРµ СѓРєР°Р·Р°РЅ"}
                  </p>

                  <div className="space-y-1 text-xs mb-4">
                    <p><strong>РљС‚Рѕ РѕРЅ С‚РµР±Рµ:</strong> {order.relation || "вЂ”"}</p>
                    <p><strong>Р’СЃРµР»РµРЅРЅС‹Рµ:</strong> {order.universes?.join(", ") || "РќРµС‚"}</p>
                    <p><strong>РџРѕРґР°СЂРѕРє РѕС‚:</strong> {order.giverType === "self" ? "РЎРµР±СЏ" : "Р”СЂСѓР·РµР№"}</p>
                  </div>

                  {status !== "new" && (
                    <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase">
                      РђРЅРєРµС‚Р° РѕР±СЂР°Р±РѕС‚Р°РЅР°
                    </p>
                  )}

                  <button
                    onClick={() => openOrder(order.id)}
                    disabled={openingId === order.id}
                    className="w-full bg-black text-white text-xs font-bold py-2 rounded uppercase hover:bg-gray-800 transition mb-3 disabled:opacity-50"
                  >
                    {openingId === order.id ? "Р—Р°РіСЂСѓР·РєР°..." : "РћС‚РєСЂС‹С‚СЊ РІСЃСЋ Р°РЅРєРµС‚Сѓ"}
                  </button>

                  <ActionButtons order={order} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* РњРѕРґР°Р»РєР° СЃ РїРѕР»РЅРѕР№ Р°РЅРєРµС‚РѕР№ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white text-black p-6 md:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-black shadow-[10px_10px_0px_#00e5ff]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2 border-b-2 border-gray-300 pb-2">
              <h2 className="text-2xl md:text-3xl font-montserrat italic font-black uppercase text-kiosk-pink">
                РђРЅРєРµС‚Р°: {selectedOrder.heroName || "Р±РµР· РёРјРµРЅРё"}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black font-black text-xl">вњ•</button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-gray-500">{selectedOrder.date}</span>
              <StatusBadge status={selectedOrder.status || "new"} />
            </div>

            {/* РџРѕР»СЏ Р°РЅРєРµС‚С‹ */}
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

            {/* Р¤РѕС‚Рѕ */}
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
                          alt={`${label} вЂ” ${i + 1}`}
                          className="w-20 h-20 object-cover border-2 border-black rounded hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Р”РµР№СЃС‚РІРёСЏ */}
            <div className="mt-8 flex gap-4">
              <ActionButtons order={selectedOrder} compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
