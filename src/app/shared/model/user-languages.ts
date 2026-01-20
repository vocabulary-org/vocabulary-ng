export interface UserLanguages {
  uuid?: string;
  language: { uuid: string } | null;
  languageTo: { uuid: string } | null;
}