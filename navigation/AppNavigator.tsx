import { getRootHeaderOptions } from "@/utils/rootHeaderOptions";
import { Stack, router } from "expo-router";

type Props = {
  headerTextColor: string;
  headerBgColor: string;
};

export default function AppNavigator({
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
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen name="onboarding" options={{ headerShown: false }} />

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
       <Stack.Screen
        name="legal-document"
        options={getRootHeaderOptions({
          router,
          headerTextColor,
          backgroundColor: headerBgColor,
          title: "register",
        })}
      />

      <Stack.Screen
        name="force-update"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
