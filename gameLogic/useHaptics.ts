import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";

export const useHaptics = () => {
  const enabled = useAppStore((state) => state.hapticsEnabled);

  const run = (fn: () => Promise<void>) => {
    if (!enabled) return;
    return fn();
  };

  return {
    light: () =>
      run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),

    medium: () =>
      run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),

    heavy: () =>
      run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),

    success: () =>
      run(() =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
      ),

    error: () =>
      run(() =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
      ),
  };
};
