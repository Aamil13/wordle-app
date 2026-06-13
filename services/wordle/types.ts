export type WordDifficulty = "easy" | "medium" | "hard";

export interface IWordles {
  _id?: string;
  id: number;
  mongo_id: string;
  word: string;
  hint: string;
  difficulty: WordDifficulty;
  category: string;
  timesPlayed: number;
  successRate: number;
  averageAttempts: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  noOfTimesShown?: number;
}

export interface WordsApiResponse {
  data: IWordles[];
  results: number;
  success: boolean;
}
