import { useQuery } from "@tanstack/react-query";

import { getLeaderboardApi } from "./api";
import { GetLeaderboardParams, LeaderboardMode } from "./types";

// GET LIVE LEADERBOARD
export function useGetLiveLeaderboard(
  mode: LeaderboardMode,
  limit?: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["leaderboard", mode, "live", limit],
    queryFn: () => getLeaderboardApi({ mode, limit }),
    enabled: enabled && !!mode,
  });
}

// GET HISTORICAL LEADERBOARD
export function useGetHistoricalLeaderboard(
  mode: LeaderboardMode,
  date: string,
  limit?: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["leaderboard", mode, date, limit],
    queryFn: () => getLeaderboardApi({ mode, date, limit }),
    enabled: enabled && !!mode && !!date,
  });
}

// GET LEADERBOARD (unified — mirrors the single API endpoint)
export function useGetLeaderboard(
  params: GetLeaderboardParams,
  enabled: boolean = true,
) {
  const { mode, date, limit } = params;
  return useQuery({
    queryKey: ["leaderboard", mode, date ?? "live", limit],
    queryFn: () => getLeaderboardApi(params),
    enabled: enabled && !!mode,
  });
}
