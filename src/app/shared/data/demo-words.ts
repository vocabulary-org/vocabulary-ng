import { WordView } from '../model/flashcard.model';

export type DemoLangCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'ru' | 'pt' | 'zh' | 'ja' | 'ar' | 'hi' | 'ko' | 'tr' | 'nl' | 'pl' | 'sv';

export interface DemoLanguage {
  code: DemoLangCode;
  name: string;
  flag: string;
}

export const DEMO_LANGUAGES: DemoLanguage[] = [
  { code: 'en', name: 'English',    flag: '🇬🇧' },
  { code: 'es', name: 'Spanish',    flag: '🇪🇸' },
  { code: 'fr', name: 'French',     flag: '🇫🇷' },
  { code: 'de', name: 'German',     flag: '🇩🇪' },
  { code: 'it', name: 'Italian',    flag: '🇮🇹' },
  { code: 'ru', name: 'Russian',    flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese',    flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese',   flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic',     flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi',      flag: '🇮🇳' },
  { code: 'ko', name: 'Korean',     flag: '🇰🇷' },
  { code: 'tr', name: 'Turkish',    flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch',      flag: '🇳🇱' },
  { code: 'pl', name: 'Polish',     flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish',    flag: '🇸🇪' },
];

interface DemoEntry {
  id: string;
  word: Record<DemoLangCode, string>;
}

const DEMO_ENTRIES: DemoEntry[] = [
  {
    id: '1',
    word: {
      en: 'Hello', es: 'Hola', fr: 'Bonjour', de: 'Hallo', it: 'Ciao',
      ru: 'Привет', pt: 'Olá', zh: '你好', ja: 'こんにちは', ar: 'مرحبا',
      hi: 'नमस्ते', ko: '안녕하세요', tr: 'Merhaba', nl: 'Hallo', pl: 'Cześć', sv: 'Hej',
    },
  },
  {
    id: '2',
    word: {
      en: 'Thank you', es: 'Gracias', fr: 'Merci', de: 'Danke', it: 'Grazie',
      ru: 'Спасибо', pt: 'Obrigado', zh: '谢谢', ja: 'ありがとう', ar: 'شكرا',
      hi: 'धन्यवाद', ko: '감사합니다', tr: 'Teşekkür ederim', nl: 'Dank je', pl: 'Dziękuję', sv: 'Tack',
    },
  },
  {
    id: '3',
    word: {
      en: 'Water', es: 'Agua', fr: 'Eau', de: 'Wasser', it: 'Acqua',
      ru: 'Вода', pt: 'Água', zh: '水', ja: '水', ar: 'ماء',
      hi: 'पानी', ko: '물', tr: 'Su', nl: 'Water', pl: 'Woda', sv: 'Vatten',
    },
  },
  {
    id: '4',
    word: {
      en: 'Book', es: 'Libro', fr: 'Livre', de: 'Buch', it: 'Libro',
      ru: 'Книга', pt: 'Livro', zh: '书', ja: '本', ar: 'كتاب',
      hi: 'किताब', ko: '책', tr: 'Kitap', nl: 'Boek', pl: 'Książka', sv: 'Bok',
    },
  },
  {
    id: '5',
    word: {
      en: 'Friend', es: 'Amigo', fr: 'Ami', de: 'Freund', it: 'Amico',
      ru: 'Друг', pt: 'Amigo', zh: '朋友', ja: '友達', ar: 'صديق',
      hi: 'दोस्त', ko: '친구', tr: 'Arkadaş', nl: 'Vriend', pl: 'Przyjaciel', sv: 'Vän',
    },
  },
  {
    id: '6',
    word: {
      en: 'Beautiful', es: 'Hermoso', fr: 'Beau', de: 'Schön', it: 'Bello',
      ru: 'Красивый', pt: 'Bonito', zh: '美丽', ja: '美しい', ar: 'جميل',
      hi: 'सुंदर', ko: '아름다운', tr: 'Güzel', nl: 'Mooi', pl: 'Piękny', sv: 'Vacker',
    },
  },
  {
    id: '7',
    word: {
      en: 'Time', es: 'Tiempo', fr: 'Temps', de: 'Zeit', it: 'Tempo',
      ru: 'Время', pt: 'Tempo', zh: '时间', ja: '時間', ar: 'وقت',
      hi: 'समय', ko: '시간', tr: 'Zaman', nl: 'Tijd', pl: 'Czas', sv: 'Tid',
    },
  },
  {
    id: '8',
    word: {
      en: 'Food', es: 'Comida', fr: 'Nourriture', de: 'Essen', it: 'Cibo',
      ru: 'Еда', pt: 'Comida', zh: '食物', ja: '食べ物', ar: 'طعام',
      hi: 'खाना', ko: '음식', tr: 'Yemek', nl: 'Eten', pl: 'Jedzenie', sv: 'Mat',
    },
  },
];

export function getDemoWords(from: DemoLangCode, to: DemoLangCode): WordView[] {
  return DEMO_ENTRIES.map(entry => ({
    uuid: entry.id,
    sentence: entry.word[from],
    translation: entry.word[to],
  }));
}
