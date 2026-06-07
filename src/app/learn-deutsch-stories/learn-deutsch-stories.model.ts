export type DeutschLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type GapCategory =
  | 'ARTICLE'
  | 'ADJECTIVE_ENDING'
  | 'PRONOUN'
  | 'PREPOSITION'
  | 'VERB_FORM';

export type GrammaticalCase = 'NOMINATIV' | 'AKKUSATIV' | 'DATIV' | 'GENITIV';

export interface StorySummary {
  uuid: string;
  title: string;
  level: DeutschLevel;
  topic: string;
}

export interface StoryGapOption {
  text: string;
  correct: boolean;
}

export interface StoryGap {
  position: number;
  category: GapCategory;
  grammaticalCase: GrammaticalCase | null;
  options: StoryGapOption[];
}

export interface Story {
  uuid: string;
  title: string;
  level: DeutschLevel;
  topic: string;
  body: string;
  gaps: StoryGap[];
}
