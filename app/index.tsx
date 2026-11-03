import { loadSettingsFromDb } from "@/localDb/settingsService";
import { getUserDataApi } from "@/services/user/api";
import { getUserToken } from "@/storage/userTokenStorage";
import { useAppStore } from "@/store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

/**
 * Entry point — loads settings from SQLite (which hydrates the Zustand store),
 * rehydrates auth state from SecureStore if a token exists,
 * then routes based on showOnboarding flag.
 */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      // Load settings and rehydrate auth in parallel
      const [, token] = await Promise.all([
        loadSettingsFromDb(),
        getUserToken(),
      ]);

      // If a token exists, try to restore the user session before routing
      if (token) {
        try {
          const res: any = await getUserDataApi();
          if (res?.data) {
            useAppStore.getState().setAuth({ user: res.data });
          }
        } catch {
          // Token may be expired — forceDeauthenticate will have deleted it.
          // Proceed without auth; the user will see the Sign In option in /main.
        }
      }

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
