import { Language, LanguageRef } from "./language";

export class Word {

    constructor(
    public uuid: string,
    public sentence: string,
    public translation: string,
    public description: string,
    public language: Language,
    public languageTo: Language,
    public tags?: TagSuggestion[]
  ) {}
}

export interface TagSuggestion {
  tag: string;
  label: string;
}

export interface CreateWordRequest {
  sentence: string;
  translation: string;
  description?: string;
  language: LanguageRef;
  languageTo: LanguageRef;
  tags?: TagSuggestion[];
}