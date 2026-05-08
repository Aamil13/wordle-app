import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { QueryClient } from "@tanstack/react-query";
import { initDatabase } from "@/localDb/pushToSqlLite";
import { firstTime } from "@/storage/onboardStorage";
import AppProviders from "@/providers/AppProvider";
import AppNavigator from "@/navigation/AppNavigator";
import { useTheme } from "@/utils/useTheme";
import { ToastContainer } from "rn-toastify";
import { useAppStore } from "@/store";

SplashScreen.preventAutoHideAsync();

export const queryClient = new QueryClient();

export default function RootLayout() {
  const color = useTheme();
  const theme = useAppStore((state) => state.theme);
  const headerTextColor = color.text;
  const headerBgColor = color.background;

  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

  const [fontsLoaded] = useFonts({
    jumpsWinter: require("../assets/fonts/JumpsWinter.otf"),
    IoSevca: require("../assets/fonts/IosevkaCharonMono-Regular.ttf"),
  });

  /**
   * App initialization
   */
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      initDatabase();
      const isFirstTime = await firstTime();
      setNeedsOnboarding(!!isFirstTime);
    } catch (error) {
      console.log("App init error:", error);
      setNeedsOnboarding(false);
    }
  };

  /**
   * Hide splash when fonts load
   */
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded || needsOnboarding === null) return null;

  return (
    <AppProviders>
      <AppNavigator
        needsOnboarding={needsOnboarding}
        headerTextColor={headerTextColor}
        headerBgColor={headerBgColor}
      />
      <ToastContainer theme={theme} />
    </AppProviders>
  );
}
