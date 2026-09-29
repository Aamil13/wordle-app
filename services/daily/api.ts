import { client } from "../apiClient";
import { DailyWordResponse } from "./type";

export async function getDailyWordApi(): Promise<DailyWordResponse> {
  const res = await client<DailyWordResponse>("/daily");
  return res as DailyWordResponse;
}


export async function updateDailyPlayedApi() {
  const res = await client(`/daily/played`, {
    method: "POST",
  });
  return res;
}
