"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Загружаем заказы при входе
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) fetchOrders();
  }, [isAuth]);

  // Вход
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      setIsAuth(true);
    } else {
      alert("Неверный пароль (подсказка: admin)");
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

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white p-6 md:p-12 font-inter">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b-2 border-white/20 pb-4">
          <h1 className="text-4xl font-montserrat italic font-black text-kiosk-yellow uppercase">Панель редакции</h1>
          <button onClick={() => setIsAuth(false)} className="text-sm font-bold text-white/50 hover:text-white">Выйти</button>
        </div>

        {loading ? (
          <p className="text-center text-white/50 animate-pulse">Загрузка заказов...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
            <p className="text-xl font-bold text-white/50">Пока нет новых заказов</p>
            <p className="text-sm text-white/30 mt-2">Заполните анкету на главной странице, чтобы проверить работу.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white text-black p-5 rounded-lg border-4 border-black shadow-[5px_5px_0px_#ff007f] relative">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-kiosk-cyan text-black text-[10px] font-bold px-2 py-1 border border-black">{order.date}</span>
                  <span className="bg-green-400 text-black text-[10px] font-bold px-2 py-1 border border-black uppercase">Новый</span>
                </div>
                
                <h2 className="text-2xl font-montserrat italic font-black uppercase mb-1">
                  {order.heroName || "Без имени"}
                </h2>
                <p className="text-sm font-bold text-gray-600 mb-3">Выпуск: {order.issue || "Не указан"}</p>
                
                <div className="space-y-1 text-xs mb-4">
                  <p><strong>Вселенные:</strong> {order.universes?.join(", ") || "Нет"}</p>
                  <p><strong>Подарок от:</strong> {order.giverType === "self" ? "Себя" : "Друзей"}</p>
                </div>

                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-black text-white text-xs font-bold py-2 rounded uppercase hover:bg-gray-800 transition"
                >
                  Открыть всю анкету
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модалка с деталями заказа */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-black shadow-[10px_10px_0px_#00e5ff]">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-300 pb-2">
              <h2 className="text-3xl font-montserrat italic font-black uppercase text-kiosk-pink">Заказ: {selectedOrder.heroName}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black font-black text-xl">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-100 p-3 rounded">
                <strong>Дата:</strong> {selectedOrder.heroBirthdate}
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <strong>Город:</strong> {selectedOrder.city}
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <strong>Любимый персонаж:</strong> {selectedOrder.favoriteCharacter}
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <strong>Питомец:</strong> {selectedOrder.pet}
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <p><strong>Уникальность:</strong> {selectedOrder.uniqueness}</p>
              <p><strong>История для комикса:</strong> {selectedOrder.story}</p>
              <p><strong>Вопросы для интервью:</strong> {selectedOrder.interviewQuestions}</p>
              <p><strong>Пожелания:</strong> {selectedOrder.wishes}</p>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-kiosk-pink text-white font-bold py-3 rounded border-2 border-black shadow-[3px_3px_0px_#000] uppercase">
                Взять в работу
              </button>
              <button className="flex-1 bg-gray-200 text-black font-bold py-3 rounded border-2 border-black hover:bg-gray-300 uppercase">
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}