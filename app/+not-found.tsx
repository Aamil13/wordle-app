import { Colors } from "@/constants/Colors";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { Stack } from "expo-router";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";

export default function NotFound() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || "dark"];

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
          <ActivityIndicator color={colors.spinner} size="large" />
          <Text
            style={{
              color: colors.text,
              marginTop: 12,
              fontFamily: "IoSevca",
              fontSize: 16,
            }}
          >
            Page does not exist
          </Text>
        </View>
      </SafeAreaWrapper>
    </>
  );
}
