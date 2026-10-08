import { initDatabase } from "@/localDb/pushToSqlLite";
import AppNavigator from "@/navigation/AppNavigator";
import AppProviders from "@/providers/AppProvider";
import { useTheme } from "@/utils/useTheme";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const color = useTheme();

  const headerTextColor = color.text;
  const headerBgColor = color.background;

  const [fontsLoaded, fontError] = useFonts({
    jumpsWinter: require("../assets/fonts/JumpsWinter.otf"),
    IoSevca: require("../assets/fonts/IosevkaCharonMono-Regular.ttf"),
  });

  // Log font loading errors
  useEffect(() => {
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [fontError]);

  /**
   * App initialization — DB only, no onboarding check here.
   * Onboarding routing is handled by app/index.tsx.
   */
  useEffect(() => {
    initDatabase();
  }, []);

  /**
   * Hide splash when fonts are loaded (or errored)
   */
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render the navigator until fonts are ready.
  // Without this guard, screens that are navigated to directly (e.g. /main
  // for returning users) mount and commit their layout before the custom font
  // is available. The button/text sizes are then calculated against the system
  // fallback font and don't reflow when jumpsWinter loads — causing cut-off or
  // multi-line text. The SplashScreen hides this blank state from the user.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProviders headerBgColor={headerBgColor}>
      <AppNavigator
        headerTextColor={headerTextColor}
        headerBgColor={headerBgColor}
      />
      <Toasts
        defaultStyle={{
          view: { backgroundColor: color.toast_background },
          indicator: { borderColor: color.toast_indicator },
          text: { color: color.toast_text },
        }}
      />
    </AppProviders>
  );
}
