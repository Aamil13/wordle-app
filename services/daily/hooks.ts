import { useMutation, useQuery } from "@tanstack/react-query";
import { getDailyWordApi, updateDailyPlayedApi } from "./api";
import { DailyWordResponse } from "./type";

export function useGetDailyWord(enabled: boolean = true) {
  return useQuery<DailyWordResponse>({
    queryKey: ["getDailyWord"],
    queryFn: () => getDailyWordApi(),
    enabled,
  });
}



export function useMardDailyPlayed() {
  return useMutation({
    mutationFn: () =>
      updateDailyPlayedApi(),
  });
}
