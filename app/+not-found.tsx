import { Colors } from "@/constants/Colors";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { Stack } from "expo-router";
import { ActivityIndicator, useColorScheme, View } from "react-native";

export default function NotFound() {
  const colorScheme = useColorScheme();
  const spinnerColor = Colors[colorScheme || "dark"].spinner;
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaWrapper>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={spinnerColor} size="large" />
        </View>
      </SafeAreaWrapper>
    </>
  );
}
