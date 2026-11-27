export type ColorPalette = "pink" | "cyan" | "purple" | "lime" | "orange";
export type Mood = "glamour" | "grunge" | "futuristic" | "nostalgic" | "edgy";

export interface MagazineParams {
  // Данные для обложки
  magazineName: string;
  issue: string;
  theme: string;
  subtitle: string;
  imagePrompt: string;
  colorPalette: ColorPalette;
  mood: Mood;
  coverLines: string[];

  heroPhoto?: string;

  // Данные из анкеты
  heroName: string;
  universes: string[];
  story: string;
  heroBirthdate: string;
  giverType: string;
  pseudonym: string;
  city: string;
  favoriteCharacter: string;
  favoriteColor: string;
  pet: string;
  uniqueness: string;
  qualities: string;
  portraitType: string;
  favoriteFood: string;
  favoritePlace: string;
  favoriteHobby: string;
  personalLetter: string;
  testType: string;
  games: string[];
  imageType: string;
  interviewQuestions: string;
  wishes: string;
}

export const STORAGE_KEY = "magazine-params";

export const DEFAULT_PARAMS: MagazineParams = {
  magazineName: "КИОСК",
  issue: "№ 001 · ВЕСНА 2026",
  theme: "Y2K REVIVAL",
  subtitle: "Твой личный глянец",
  imagePrompt: "young woman, early 2000s Y2K style",
  colorPalette: "pink",
  mood: "glamour",
  coverLines: [
    "10 СЕКРЕТОВ КРАСОТЫ",
    "НОВЫЕ ПРАВИЛА СТИЛЯ",
    "СПЕЦИАЛЬНЫЙ ВЫПУСК",
  ],
  heroPhoto: "",
  heroName: "Саша",
  universes: ["Монстр Хай", "Барби"],
  story: "",
  heroBirthdate: "12.05.2000",
  giverType: "self",
  pseudonym: "Санёк",
  city: "Москва",
  favoriteCharacter: "Барби",
  favoriteColor: "розовый",
  pet: "кот Барсик",
  uniqueness: "умеет шевелить ушами",
  qualities: "веселая, добрая, красивая",
  portraitType: "world",
  favoriteFood: "пицца",
  favoritePlace: "Париж",
  favoriteHobby: "фотографировать",
  personalLetter: "",
  testType: "points",
  games: ["Раскраска", "Кроссворд"],
  imageType: "playlist",
  interviewQuestions: "Какая твоя мечта?",
  wishes: "С днем рождения!",
};