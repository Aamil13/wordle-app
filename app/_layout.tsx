// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

import React, { useState } from "react";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(true);
  const [fontsLoaded] = useFonts({
    jumpsWinter: require("../assets/fonts/JumpsWinter.otf"),
  });
  //   useEffect(() => {
  //     (async () => {
  //       const v = await AsyncStorage.getItem("onboarded");
  //       setNeedsOnboarding(v !== "true");
  //     })();
  //   }, []);

  if (needsOnboarding === null) return null; // or a splash/loading screen

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }
  return (
    <Stack>
      {needsOnboarding && (
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
