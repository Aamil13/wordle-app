import { loadSettingsFromDb } from "@/localDb/settingsService";
import { useAppStore } from "@/store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

/**
 * Entry point — loads settings from SQLite (which hydrates the Zustand store),
 * then routes based on showOnboarding flag instead of SecureStore.
 */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      await loadSettingsFromDb();
      const { showOnboarding } = useAppStore.getState();
      router.replace(showOnboarding ? "/onboarding" : "/main");
    };

    initialize().catch(() => {
      router.replace("/main");
    });
  }, []);

  // Render an empty view — splash screen covers this while fonts load
  return <View style={{ flex: 1 }} />;
}
