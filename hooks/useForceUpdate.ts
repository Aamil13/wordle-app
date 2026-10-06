
import { useGetAppUpdateStatus } from "@/services/appVersion";
import * as Application from "expo-application";
import { useEffect } from "react";
import { BackHandler } from "react-native";

type AppUpdateData = {
  shouldUpdate: boolean;
  message: string;
};

function isAppUpdateData(data: unknown): data is AppUpdateData {
  return (
    typeof data === "object" &&
    data !== null &&
    "shouldUpdate" in data &&
    "message" in data
  );
}

export function useForceUpdate() {
  const { data, isLoading } = useGetAppUpdateStatus();
  const currentVersion = Application.nativeApplicationVersion ?? "1.0.0";
  const shouldUpdate = isAppUpdateData(data) ? data.shouldUpdate : false;
  const message = isAppUpdateData(data) ? data.message : "Please update your app to continue.";

  useEffect(() => {
    if (!shouldUpdate) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    return () => subscription.remove();
  }, [shouldUpdate]);

  return {
    shouldUpdate,
    currentVersion,
    isLoading,
    message,
  };
}
