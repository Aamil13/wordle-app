import { Stack, router } from "expo-router";
import { getRootHeaderOptions } from "@/utils/rootHeaderOptions";

type Props = {
  needsOnboarding: boolean;
  headerTextColor: string;
  headerBgColor: string;
};

export default function AppNavigator({
  needsOnboarding,
  headerTextColor,
  headerBgColor,
}: Props) {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: headerBgColor,
        },
      }}
    >
      {needsOnboarding && (
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      )}

      <Stack.Screen name="main" options={{ headerShown: false }} />

      <Stack.Screen name="game-over" options={{ headerShown: false }} />

      <Stack.Screen
        name="(auth)/login"
        options={getRootHeaderOptions({
          router,
          headerTextColor,
          backgroundColor: headerBgColor,
          title: "main",
        })}
      />
      <Stack.Screen
        name="(auth)/register"
        options={getRootHeaderOptions({
          router,
          headerTextColor,
          backgroundColor: headerBgColor,
          title: "main",
        })}
      />
      <Stack.Screen
        name="(auth)/forgot-password"
        options={getRootHeaderOptions({
          router,
          headerTextColor,
          backgroundColor: headerBgColor,
          title: "login",
        })}
      />
      <Stack.Screen
        name="(auth)/reset-password"
        options={getRootHeaderOptions({
          router,
          headerTextColor,
          backgroundColor: headerBgColor,
          title: "verify-otp",
        })}
      />
      <Stack.Screen
        name="(auth)/verify-otp"
        options={getRootHeaderOptions({
          router,
          headerTextColor,
          backgroundColor: headerBgColor,
          title: "register",
        })}
      />

      <Stack.Screen
        name="game"
        options={getRootHeaderOptions({
          router,
          headerTextColor,
          backgroundColor: headerBgColor,
          title: "main",
        })}
      />
    </Stack>
  );
}
