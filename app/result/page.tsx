"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MagazineCover from "@/components/MagazineCover";
import { STORAGE_KEY } from "@/types/magazine";
import type { MagazineParams } from "@/types/magazine";

export default function ResultPage() {
  const router = useRouter();
  const ran = useRef(false);
  const objectUrlRef = useRef<string | null>(null);

  const [params, setParams] = useState<MagazineParams | null>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [downloading, setDownloading] = useState(false);

  // Cleanup blob URL при размонтировании
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      router.replace("/");
      return;
    }

    let parsed: MagazineParams;
    try {
      parsed = JSON.parse(raw);
    } catch {
      router.replace("/");
      return;
    }

    setParams(parsed);
    if (parsed.heroPhoto) { setImageUrl(parsed.heroPhoto); setLoading(false); } else generate(parsed);
  }, [router]);

  const generate = async (p: MagazineParams) => {
    setLoading(true);
    setError(undefined);
    setImageUrl(undefined);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Сервер вернул ${res.status}`);
      }

      const data = await res.json();
      if (!data.imageUrl) throw new Error("Сервер не вернул изображение");

      // Загружаем через прокси (same-origin, без CORS).
      // 60 секунд — на случай медленной генерации у Pollinations.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60_000);

      let imgRes: Response;
      try {
        imgRes = await fetch(data.imageUrl, { signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!imgRes.ok) {
  const errBody = await imgRes.json().catch(() => ({}));
  throw new Error(
    errBody.error ||
      `Не удалось получить изображение (${imgRes.status})`
  );
}

      const blob = await imgRes.blob();
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;
      setImageUrl(objectUrl);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setError(
          "Превышено время ожидания (60 сек). Сервис генерации перегружен — попробуйте позже."
        );
      } else {
        setError(
          e instanceof Error ? e.message : "Не удалось сгенерировать"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    const el = document.getElementById("magazine-cover");
    if (!el) return;

    setDownloading(true);
    try {
      const { domToPng } = await import("modern-screenshot");
      const dataUrl = await domToPng(el, {
        scale: 2,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `${params?.magazineName || "cover"}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Ошибка при скачивании:", e);
      setError("Не удалось сохранить PNG");
    } finally {
      setDownloading(false);
    }
  };

  if (!params) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white/40 text-sm">
        Загрузка...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div
        className="pointer-events-none fixed -top-40 -left-40 w-[520px] h-[520px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, #ff1493, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed -bottom-40 -right-40 w-[520px] h-[520px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, #9d4edd, transparent 70%)" }}
      />

      <header className="relative z-20 sticky top-0 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition"
          >
            ← Назад к настройкам
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generate(params)}
              disabled={loading}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-white/15 rounded-md hover:bg-white/5 transition disabled:opacity-40"
            >
              ⟳ Пересоздать
            </button>
            <button
              onClick={handleDownload}
              disabled={!imageUrl || downloading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  !imageUrl || downloading
                    ? "#333"
                    : "linear-gradient(90deg, #ff1493, #9d4edd)",
              }}
            >
              {downloading ? "Сохраняем..." : "⬇ Скачать PNG"}
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-6">
          <div className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-2">
            {loading ? "● Генерация" : error ? "● Ошибка" : "● Готово"}
          </div>
          <h1 className="font-anton text-3xl md:text-4xl tracking-tight">
            {loading
              ? "Собираем обложку..."
              : error
                ? "Что-то пошло не так"
                : "Твоя обложка готова"}
          </h1>
          {!loading && !error && (
            <p className="text-xs text-white/50 mt-2">
              {params.magazineName} · {params.issue}
            </p>
          )}
        </div>

        <div className="relative">
          {error ? (
            <div className="aspect-[3/4] rounded-lg border border-red-500/30 bg-red-500/5 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-sm text-white/80 mb-1">{error}</p>
              <p className="text-xs text-white/40 mb-6">
                Проверь соединение или попробуй ещё раз
              </p>
              <button
                onClick={() => generate(params)}
                className="px-5 py-2 text-xs font-bold rounded-md text-white"
                style={{ background: "linear-gradient(90deg, #ff1493, #9d4edd)" }}
              >
                Попробовать снова
              </button>
            </div>
          ) : (
            <>
              <MagazineCover params={params} imageUrl={imageUrl} />
              {loading && (
                <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                  <div className="w-10 h-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin mb-4" />
                  <p className="text-xs text-white/60">
                    Генерируем модель и свет...
                  </p>
                  <p className="text-[10px] text-white/40 mt-2">
                    Это может занять до 15–20 секунд
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {!loading && !error && (
          <div className="mt-6 flex items-center justify-between text-[11px] text-white/40">
            <span>
              {params.coverLines.filter(Boolean).length} заголовков ·{" "}
              {params.colorPalette} · {params.mood}
            </span>
            <button
              onClick={() => router.push("/")}
              className="hover:text-white transition"
            >
              Изменить →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}