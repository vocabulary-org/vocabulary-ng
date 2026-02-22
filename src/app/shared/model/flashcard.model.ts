export interface WordView {
  uuid: string;
  sentence: string;
  translation: string;
}

export interface WordLearning {
  uuid: string;
  wordView: WordView;
  rightCount: number;
  wrongCount: number;
  skipCount: number;
  reviewResult: WordReviewResultType | null;
}

export type WordReviewResultType = 'RIGHT' | 'WRONG' | 'SKIP';

export interface WordReviewResult {
  wordUuid: string;
  wordReviewResultType: WordReviewResultType;
}
