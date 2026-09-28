import { useMutation, useQuery } from "@tanstack/react-query";

import {
  batchUpdateStatsApi,
  getAllStatsApi,
  getStatsByModeApi,
  resetStatsApi,
  updateInfiniteSessionApi,
  updateStatsApi,
} from "./api";
import {
  BatchUpdateRequest,
  GameMode,
  InfiniteSessionRequest,
  UpdateStatsRequest,
} from "./types";

// UPDATE STATS
export function useUpdateStats() {
  return useMutation({
    mutationFn: (data: UpdateStatsRequest) => updateStatsApi(data),
  });
}

// UPDATE INFINITE SESSION
export function useUpdateInfiniteSession() {
  return useMutation({
    mutationFn: (data: InfiniteSessionRequest) => updateInfiniteSessionApi(data),
  });
}

// GET ALL STATS
export function useGetAllStats(enabled: boolean = true) {
  return useQuery({
    queryKey: ["getAllStats"],
    queryFn: () => getAllStatsApi(),
    enabled,
  });
}

// GET STATS BY GAME MODE
export function useGetStatsByMode(gameMode: GameMode, enabled: boolean = true) {
  return useQuery({
    queryKey: ["getStatsByMode", gameMode],
    queryFn: () => getStatsByModeApi(gameMode),
    enabled: enabled && !!gameMode,
  });
}

// RESET STATS
export function useResetStats() {
  return useMutation({
    mutationFn: (gameMode: GameMode) => resetStatsApi(gameMode),
  });
}

// BATCH UPDATE STATS
export function useBatchUpdateStats() {
  return useMutation({
    mutationFn: (data: BatchUpdateRequest) => batchUpdateStatsApi(data),
  });
}
