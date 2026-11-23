export type ColorPalette = "pink" | "cyan" | "purple" | "lime" | "orange";
export type Mood = "glamour" | "grunge" | "futuristic" | "nostalgic" | "edgy";

export interface MagazineParams {
  magazineName: string;
  issue: string;
  theme: string;
  subtitle: string;
  imagePrompt: string;
  colorPalette: ColorPalette;
  mood: Mood;
  coverLines: string[];
}

export const STORAGE_KEY = "magazine-params";

export const DEFAULT_PARAMS: MagazineParams = {
  magazineName: "MEGA",
  issue: "№ 08 · 2026",
  theme: "Y2K REVIVAL",
  subtitle: "Возвращение нулевых",
  imagePrompt:
    "Young model with frosted tips, silver choker, glossy studio lighting, airbrushed skin, early 2000s fashion editorial",
  colorPalette: "pink",
  mood: "glamour",
  coverLines: [
    "10 СЕКРЕТОВ КРАСОТЫ, О КОТОРЫХ МОЛЧАЛИ",
    "НОВЫЕ ПРАВИЛА СТИЛЯ",
    "СПЕЦИАЛЬНЫЙ ВЫПУСК",
  ],
};