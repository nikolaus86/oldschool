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

  // ШАГ 1 — ГЕРОЙ
  heroName: string;
  heroBirthdate: string;
  pseudonym: string; // как к нему обращаешься (если хочешь)
  relation: string; // кто он тебе
  giverType: string; // посланник подарка
  universes: string[];

  // ШАГ 2 — ЛИЧНОСТЬ
  city: string;
  favoriteCharacter: string;
  favoriteColor: string;
  pet: string;
  uniqueness: string;
  qualities: string;
  extraPhotos: string[]; // любимые / детские фото

  // ШАГ 3 — ПОРТРЕТ ИЛИ ПИСЬМО
  portraitType: string; // world | letter
  favoriteFood: string;
  favoritePlace: string;
  favoriteSeason: string;
  favoriteHobby: string;
  personalLetter: string;
  portraitPhotos: string[];

  // ШАГ 4 — ТЕСТЫ, ИГРЫ, КОМИКС
  testType: string; // points | arrows
  testTopic: string;
  games: string[];
  gamePersonal: string; // yes | no
  gameDetails: string;
  story: string; // история для комикса

  // ШАГ 5 — ОБРАЗЫ, ИНТЕРВЬЮ, WISHES
  imageType: string; // playlist | cinema | style | attributes
  playlist: string;
  cinema: string;
  styleNote: string;
  attributes: string;
  interviewQuestions: string;
  wishes: string;
  memoryPhotos: string[];
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
  heroName: "",
  heroBirthdate: "",
  pseudonym: "",
  relation: "",
  giverType: "self",
  universes: [],
  city: "",
  favoriteCharacter: "",
  favoriteColor: "",
  pet: "",
  uniqueness: "",
  qualities: "",
  extraPhotos: [],
  portraitType: "world",
  favoriteFood: "",
  favoritePlace: "",
  favoriteSeason: "",
  favoriteHobby: "",
  personalLetter: "",
  portraitPhotos: [],
  testType: "points",
  testTopic: "",
  games: [],
  gamePersonal: "no",
  gameDetails: "",
  story: "",
  imageType: "playlist",
  playlist: "",
  cinema: "",
  styleNote: "",
  attributes: "",
  interviewQuestions: "",
  wishes: "",
  memoryPhotos: [],
};
