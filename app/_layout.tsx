// import AsyncStorage from "@react-native-async-storage/async-storage";
import RootHeader from "@/components/molecules/rootHeader";
import { Colors } from "@/constants/Colors";
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
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(true);
  const colorScheme = useColorScheme();
  const headerTextColor = Colors[colorScheme || "dark"].text;
  const [fontsLoaded] = useFonts({
    jumpsWinter: require("../assets/fonts/JumpsWinter.otf"),
  });

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

  //   if (needsOnboarding === null) return null; // or a splash/loading screen

  //   if (!fontsLoaded) {
  //     return null; // or a loading indicator
  //   }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
    </ThemeProvider>
  );
}

// const StackHolder = ({
//   needsOnboarding,
//   headerTextColor,
// }: {
//   needsOnboarding: boolean;
//   headerTextColor: string;
// }) => {
//   const { isLoaded } = useAuth();
//   console.log("isLoadded", isLoaded);

//   return (
//     <Stack>
//       {!isLoaded && (
//         <Stack.Screen name="loading" options={{ headerShown: false }} />
//       )}
//       {needsOnboarding && (
//         <Stack.Screen name="onboarding" options={{ headerShown: false }} />
//       )}
//       <Stack.Screen name="main" options={{ headerShown: false }} />
//       <Stack.Screen
//         name="login"
//         options={{
//           presentation: "modal",
//           title: "",
//           headerShadowVisible: false,
//           headerLeft: () => (
//             <View>
//               <TouchableOpacity
//                 onPress={() => router.back()}
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   gap: 4,
//                 }}
//               >
//                 <Ionicons name="navigate" size={26} color={headerTextColor} />
//                 <CustomText>Back</CustomText>
//               </TouchableOpacity>
//             </View>
//           ),
//         }}
//       />
//     </Stack>
//   );
// };
