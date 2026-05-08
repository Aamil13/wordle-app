import { useQuery } from "@tanstack/react-query";
import { getUserDataApi } from "./api";

export function useGetUserData(enabled: boolean) {
  return useQuery({
    queryKey: ["getRefetchUserData"],
    queryFn: () => getUserDataApi(),
    enabled: enabled,
  });
}
