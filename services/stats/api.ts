import { client } from "../apiClient";
import {
    BatchUpdateRequest,
    GameMode,
    InfiniteSessionRequest,
    UpdateStatsRequest
} from "./types";

// UPDATE STATS
export async function updateStatsApi(data: UpdateStatsRequest) {
  const res = await client("/stats/update", {
    method: "POST",
    data: data,
  });
  return res;
}

// UPDATE INFINITE SESSION
export async function updateInfiniteSessionApi(data: InfiniteSessionRequest) {
  const res = await client("/stats/infinite/session", {
    method: "POST",
    data: data,
  });
  return res;
}

// GET ALL STATS
export async function getAllStatsApi() {
  const res = await client("/stats");
  return res;
}

// GET STATS BY GAME MODE
export async function getStatsByModeApi(gameMode: GameMode) {
  const res = await client(`/stats/${gameMode}`);
  return res;
}

// RESET STATS
export async function resetStatsApi(gameMode: GameMode) {
  const res = await client(`/stats/${gameMode}`, {
    method: "DELETE",
  });
  return res;
}

// BATCH UPDATE STATS
export async function batchUpdateStatsApi(data: BatchUpdateRequest) {
  const res = await client("/stats/batch-update", {
    method: "POST",
    data: data,
  });
  return res;
}
