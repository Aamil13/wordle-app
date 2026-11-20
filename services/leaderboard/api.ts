import { client } from "../apiClient";
import { GetLeaderboardParams, LeaderboardApiResponse } from "./types";

// GET LEADERBOARD (live or historical)
export async function getLeaderboardApi(params: GetLeaderboardParams) {
  const { mode, limit, date } = params;

  const res = await client<LeaderboardApiResponse>("/leaderboard", {
    method: "GET",
    // `params` is not a named key in RequestData so it flows through `...rest`
    // and lands directly on the Axios request config as query string params.
    params: {
      mode,
      ...(limit !== undefined && { limit }),
      ...(date !== undefined && { date }),
    },
  } as any);

  return res as LeaderboardApiResponse;
}
