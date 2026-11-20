export type LeaderboardMode = "daily" | "infinite" | "timeAttack";

export interface LeaderboardRow {
  rank: number;
  userId: string;
  userName: string;
  avatar: string | null;
  score: number;
}

export interface GetLeaderboardParams {
  mode: LeaderboardMode;
  limit?: number;
  date?: string; // "YYYY-MM-DD" — omit for live leaderboard
}

export interface LeaderboardApiResponse {
  success: boolean;
  mode: LeaderboardMode;
  date: string;
  live: boolean;
  total: number;
  leaderboard: LeaderboardRow[];
}
