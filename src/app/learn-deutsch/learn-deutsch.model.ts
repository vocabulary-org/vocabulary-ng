export interface DeutschNoun {
  uuid: string;
  wordDe: string;
  article: string;
  pluralDe: string;
  pluralDistractors: string[];
}

export interface PracticeItem {
  word: string;
  correctAnswer: string;
  hint: string;
  options: string[];
}
