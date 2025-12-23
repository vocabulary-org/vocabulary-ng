// src/app/shared/model/translate-request.model.ts
export interface TranslateRequest {
  text: string;
  from: string;
  to: string[];
}
