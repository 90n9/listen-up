export type Level = 1 | 2 | 3;

export type Theme = 'family' | 'animals' | 'daily' | 'manners' | 'nature' | 'food';

export interface Question {
  q: string;
  /** Model answer shown when the parent taps เฉลย. */
  answer: string;
}

export interface StorySet {
  id: string;
  level: Level;
  themes: Theme[];
  /** Short label for the browse grid and recently-played list. */
  title: string;
  /** The passage the parent reads aloud. */
  sentence: string;
  questions: Question[];
}

export const THEME_LABELS: Record<Theme, string> = {
  family: 'ครอบครัว',
  animals: 'สัตว์',
  daily: 'ชีวิตประจำวัน',
  manners: 'มารยาท',
  nature: 'ธรรมชาติ',
  food: 'อาหาร',
};

export const LEVEL_LABELS: Record<Level, string> = {
  1: 'ง่าย',
  2: 'ปานกลาง',
  3: 'ท้าทาย',
};
