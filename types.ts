export enum QuestionType {
  SingleChoice,
  MultipleChoice,
  RatingScale,
  OpenEnded,
}

export interface Question {
  id: string;
  section?: 'adult' | 'parents';
  type: QuestionType;
  text: string;
  options?: string[];
  criteria?: string[];
  maxChoices?: number;
  isOptional?: boolean;
}

export type Answers = {
  [key: string]: any;
};