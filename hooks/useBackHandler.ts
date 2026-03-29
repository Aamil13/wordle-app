import { useRouter, useSegments, useNavigation } from "expo-router";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

const BLOCKED_ROUTES = ["login", "register"];

export const useBackHandler = (enabled = true) => {
  const router = useRouter();
  const segments = useSegments();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;

      const onBack = (e: any) => {
        const isBackAction = e.data.action.type === "GO_BACK";

        if (!isBackAction) return; // ✅ ignore non-back actions

        const currentRoute = segments[segments.length - 1];

        const isBlocked =
          BLOCKED_ROUTES.includes(currentRoute) ||
          segments.some((seg) => BLOCKED_ROUTES.includes(seg));

        if (isBlocked) {
          e.preventDefault();
          router.replace("/main");
        }
      };

      const unsubscribe = navigation.addListener("beforeRemove", onBack);

      return unsubscribe;
    }, [enabled, navigation, router, segments]),
  );
};
