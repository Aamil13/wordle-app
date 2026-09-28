export type GameMode = "daily" | "infinite" | "timeAttack";

export enum GameModeEnum {
  DAILY = "daily",
  INFINITE = "infinite",
  TIME_ATTACK = "timeAttack",
}

export interface GameResult {
  won: boolean;
  guesses?: number;
  timeSeconds?: number;
}

export interface UpdateStatsRequest {
  gameMode: GameMode;
  result: GameResult;
}

export interface InfiniteSessionRequest {
  sessionLength: number;
}

export interface BatchUpdateGame {
  gameMode: GameMode;
  result: GameResult;
}

export interface BatchUpdateRequest {
  games: BatchUpdateGame[];
}

export interface Stats {
  _id?: string;
  userId: string;
  gameMode: GameMode;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: {
    [key: number]: number;
  };
  averageGuesses: number;
  bestTime?: number;
  totalTime: number;
  lastPlayed?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StatsApiResponse {
  data: Stats;
  success: boolean;
  message?: string;
}

export interface AllStatsApiResponse {
  data: Stats[];
  success: boolean;
  message?: string;
}

export interface DeleteApiResponse {
  success: boolean;
  message?: string;
}
