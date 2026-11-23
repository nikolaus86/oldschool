export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return Response.json({ error: "Missing url" }, { status: 400 });
  }

  // Берем ключ из переменных окружения
  const apiKey = process.env.POLLINATIONS_API_KEY;

  // Заголовки для запроса к Pollinations
  const headers: Record<string, string> = {
    "Accept": "image/jpeg,image/png,application/json",
  };
  
  // Если ключ есть, добавляем его в Authorization
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const MAX_ATTEMPTS = 6;
  const DELAY_MS = 3000;

  let lastStatus = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);

    try {
      const upstream = await fetch(imageUrl, {
        cache: "no-store",
        signal: controller.signal,
        headers,
      });

      lastStatus = upstream.status;
      const contentType = upstream.headers.get("content-type") || "";

      console.log(
        `[proxy] attempt ${attempt}/${MAX_ATTEMPTS}: ${upstream.status} ${contentType}`
      );

      // Успех
      if (upstream.status === 200 && contentType.startsWith("image/")) {
        const buf = await upstream.arrayBuffer();
        return new Response(buf, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      }

      // Если 503 — модель генерирует, ждем и повторяем
      if (upstream.status === 503) {
        clearTimeout(timeoutId);
        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, DELAY_MS));
        }
        continue;
      }

      // Если 402 — это лимит (если нет ключа или он кончился)
      if (upstream.status === 402) {
        const text = await upstream.text().catch(() => "");
        console.error(`[proxy] fail-fast 402 (Limit): ${text.slice(0, 200)}`);
        clearTimeout(timeoutId);
        return Response.json(
          { error: "Достигнут лимит генераций. Подождите 45 секунд или добавьте POLLINATIONS_API_KEY в .env.local." },
          { status: 502 }
        );
      }

      // Другие ошибки
      if (upstream.status >= 400 && upstream.status < 500) {
        const text = await upstream.text().catch(() => "");
        console.error(`[proxy] fail-fast ${upstream.status}: ${text.slice(0, 200)}`);
        clearTimeout(timeoutId);
        return Response.json(
          { error: `Сервис вернул ${upstream.status}` },
          { status: 502 }
        );
      }

      // Прочие 5xx
      if (attempt < MAX_ATTEMPTS) {
        clearTimeout(timeoutId);
        await new Promise((r) => setTimeout(r, DELAY_MS));
        continue;
      }
    } catch (err) {
      console.error(`[proxy] attempt ${attempt} exception:`, err);
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, DELAY_MS));
        continue;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return Response.json(
    { error: `Pollinations не отдал результат (статус: ${lastStatus}).` },
    { status: 504 }
  );
}