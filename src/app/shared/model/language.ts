export interface Language {
    uuid: string;
    name: string;
    code: string;
}


export type LanguageRef = Omit<Language, 'name'>; // no name