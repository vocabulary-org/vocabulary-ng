export interface Language {
    uuid: string;
    name: string;
}


export type LanguageRef = Omit<Language, 'name'>; // no name