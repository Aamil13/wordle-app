import { useQuery } from "@tanstack/react-query";
import { client } from "../apiClient";

export async function getAppUpdateStatus() {
  const response = await client<{
    shouldUpdate: boolean;
    message: string;
  }>(`/app-version/required`);

  return response;
}

export function useGetAppUpdateStatus() {
  return useQuery({
    queryKey: ["appUpdateStatus"],
    queryFn: getAppUpdateStatus,
  });
}
