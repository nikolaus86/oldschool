import { NextResponse } from "next/server";
import type { MagazineParams } from "@/types/magazine";

const MOOD_MAP: Record<string, string> = {
  glamour: "glamour, high fashion, elegant",
  grunge: "grunge, edgy, dark, alternative",
  futuristic: "futuristic, cyber, neon",
  nostalgic: "nostalgic, retro, vintage",
  edgy: "edgy, bold, dramatic",
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as MagazineParams;
    const moodEn = MOOD_MAP[body.mood] || body.mood;

    const finalPrompt = [
  body.imagePrompt,
  `character in the style of ${body.universes}`,
  `mood: ${moodEn}`,
  "early 2000s magazine cover aesthetic",
  "glossy, airbrushed skin, Y2K fashion editorial",
  "high resolution, professional photography",
].filter(Boolean).join(", ").slice(0, 300);

    const encoded = encodeURIComponent(finalPrompt);
    const seed = Math.floor(Math.random() * 999_999);

    // Формируем чистый URL без токена.
    // Токен добавит прокси-роут в заголовках.
    const upstream = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=1024&seed=${seed}&model=flux`;

    const imageUrl = `/api/proxy?url=${encodeURIComponent(upstream)}`;
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("[generate] Ошибка:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка" },
      { status: 500 }
    );
  }
}