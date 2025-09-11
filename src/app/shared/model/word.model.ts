export class Word {

    constructor(
    public uuid: string,
    public sentence: string,
    public translation: string,
    public description: string,
    public language: string,
    public languageTo: string
  ) {}
}

export type CreateWordRequest = Omit<Word, 'uuid'>; // no uuid on create