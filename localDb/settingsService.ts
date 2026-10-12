import { useAppStore } from "@/store";
import { db } from "./sqlLite";

type SettingsRow = {
  id: number;
  bgEnabled: number;
  hapticsEnabled: number;
  volume: number;
  keyboardSoundEnabled: number;
  keyboardSoundOnPressEnabled: number;
  theme: "dark" | "light";
  showOnboarding: number;
};

export const loadSettingsFromDb = async () => {
  // const result = await db.getFirstAsync(
  //   "SELECT * FROM settings LIMIT 1"
  // );
  const result = db.getFirstSync<SettingsRow>(
    "SELECT * FROM settings WHERE id = 1",
  );

  const store = useAppStore.getState();

  if (result) {
    // useAppStore.getState().hydrateFromDb({
    //   bgEnabled: !!result.bgEnabled,
    //   hapticsEnabled: !!result.hapticsEnabled,
    //   volume: result.volume,
    // });
    useAppStore.getState().hydrateFromDb({
      bgEnabled: result.bgEnabled === 1,
      hapticsEnabled: result.hapticsEnabled === 1,
      keyboardSoundEnabled: result.keyboardSoundEnabled === 1,
      keyboardSoundOnPressEnabled: result.keyboardSoundOnPressEnabled === 1,
      theme: result.theme,
      volume: result.volume,
      showOnboarding: result.showOnboarding === 1,
    });
  }
  store.setHydrated(true);
};

export const saveSettingsToDb = async () => {
  const { bgEnabled, hapticsEnabled, volume, keyboardSoundEnabled, keyboardSoundOnPressEnabled, theme, showOnboarding } =
    useAppStore.getState();

  await db.runAsync(
    `UPDATE settings SET bgEnabled=?, hapticsEnabled=?, keyboardSoundEnabled=?, keyboardSoundOnPressEnabled=?, theme=?, volume=?, showOnboarding=? WHERE id=1`,
    [
      bgEnabled ? 1 : 0,
      hapticsEnabled ? 1 : 0,
      keyboardSoundEnabled ? 1 : 0,
      keyboardSoundOnPressEnabled ? 1 : 0,
      theme,
      volume,
      showOnboarding ? 1 : 0,
    ],
  );
};
