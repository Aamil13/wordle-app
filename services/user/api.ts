import { client } from "../apiClient";

export async function getUserDataApi() {
  const res: any = await client("/auth/me");
  return res;
}
