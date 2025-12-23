// src/app/shared/model/translate-response.model.ts

export interface TranslateResponse {
  translations: Translation[];
}

export interface Translation {
  text: string;
  to: string;
}
