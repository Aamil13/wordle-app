import RootHeader from "@/components/molecules/rootHeader";
import { Colors } from "@/constants/Colors";
import { AudioProvider } from "@/context/audio";
import { initDatabase } from "@/localDb/pushToSqlLite";
import { firstTime } from "@/storage/onboardStorage";
import { useAppStore } from "@/store";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const theme = useAppStore((state) => state.theme);

  const headerTextColor = Colors[theme || "dark"].text;
  const [fontsLoaded] = useFonts({
    jumpsWinter: require("../assets/fonts/JumpsWinter.otf"),
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await firstTime();
      if (value) {
        setNeedsOnboarding(true);
        //  await setOnboarding("true")
      } else {
        setNeedsOnboarding(false);
      }
    };
    initDatabase();
    checkOnboarding();
  }, []);

  //   useEffect(() => {
  //     (async () => {
  //       const v = await AsyncStorage.getItem("onboarded");
  //       setNeedsOnboarding(v !== "true");
  //     })();
  //   }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (needsOnboarding === null) return null; // or a splash/loading screen

  //   if (!fontsLoaded) {
  //     return null; // or a loading indicator
  //   }
  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <AudioProvider>
        <ClerkProvider tokenCache={tokenCache}>
          <ClerkLoaded>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <Stack>
                  {needsOnboarding && (
                    <Stack.Screen
                      name="onboarding"
                      options={{ headerShown: false }}
                    />
                  )}
                  <Stack.Screen name="main" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="game-over"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="login"
                    options={{
                      title: "",
                      headerShadowVisible: false,
                      headerLeft: () => (
                        <RootHeader
                          onClick={() => router.back()}
                          headerTextColor={headerTextColor}
                        />
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="game"
                    options={{
                      title: "",
                      headerShadowVisible: false,
                      headerLeft: () => (
                        <RootHeader
                          onClick={() => router.back()}
                          headerTextColor={headerTextColor}
                        />
                      ),
                    }}
                  />
                </Stack>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </ClerkLoaded>
        </ClerkProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}
