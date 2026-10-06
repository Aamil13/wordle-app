import { CustomButton } from "@/components/atoms/Button";
import { CustomText } from "@/components/atoms/customText";
import { useForceUpdate } from "@/hooks/useForceUpdate";
import { deleteUserToken } from "@/storage/userTokenStorage";
import { useAppStore } from "@/store";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { BackHandler, Linking, Platform, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ForceUpdateScreen() {
  const { shouldUpdate, message } = useForceUpdate();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const clearAuth = useAppStore((s) => s.clearAuth);
  const insets = useSafeAreaInsets();

  const colors = {
    bg: isDark ? "#211f1fff" : "#FFF8F0",
    primary: isDark ? "#FF8AAE" : "#FF6F91",
    secondary: isDark ? "#715d33ff" : "#ebc47cff",
    tertiary: isDark ? "#463d94ff" : "#6A5CF6",
    text: isDark ? "#FFFFFF" : "#ffffffff",
    primaryDescription: isDark ? "#c8babaff" : "#555555",
    description: isDark ? "#c8babaff" : "#fffcfcff",
  };

  // Prevent back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => backHandler.remove();
  }, []);

  const handleUpdate = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("https://apps.apple.com/us/app/unibuzz-app/id6751199821");
    } else {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.unibuzzapp&hl=en-US",
      );
    }
  };

  // If shouldUpdate is false, logout and go back
  useEffect(() => {
    if (!shouldUpdate) {
      clearAuth();
      deleteUserToken();
      router.back();
    }
  }, [shouldUpdate, clearAuth, router]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tertiary,
          marginTop: insets.top,
          marginBottom: insets.bottom,
        },
      ]}
    >
      <LottieView
        source={require("../assets/onboarding/partydance.json")}
        style={styles.lottie}
        autoPlay
        loop
      />
      <CustomText size={28} color={colors.text} style={styles.title}>
        Update Required
      </CustomText>
      <CustomText size={16} color={colors.description} style={styles.message}>
        {message}
      </CustomText>
      <CustomButton
        text="Update Now"
        onPress={handleUpdate}
        variant="primary"
        initialRotation={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
