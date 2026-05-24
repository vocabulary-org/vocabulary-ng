export interface ExampleView {
  sentenceDe: string;
  sentenceTranslation: string;
}

export interface DeutschNoun {
  uuid: string;
  wordDe: string;
  article: string;
  pluralDe: string;
  pluralDistractors: string[];
  translation: string | null;
  examples: ExampleView[];
}

export interface PracticeItem {
  word: string;
  correctAnswer: string;
  hint: string;
  options: string[];
  translation: string | null;
  examples: ExampleView[];
}
