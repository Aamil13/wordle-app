import { useAppStore } from "@/store";
import { db } from "./sqlLite";

type SettingsRow = {
  id: number;
  bgEnabled: number;
  hapticsEnabled: number;
  volume: number;
  keyboardSoundEnabled: number;
  theme: "dark" | "light";
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
      theme: result.theme,
      volume: result.volume,
    });
  }
  store.setHydrated(true);
};

export const saveSettingsToDb = async () => {
  const { bgEnabled, hapticsEnabled, volume, keyboardSoundEnabled, theme } =
    useAppStore.getState();

  await db.runAsync(
    `UPDATE settings SET bgEnabled=?, hapticsEnabled=?, keyboardSoundEnabled=?, theme=?, volume=? WHERE id=1`,
    [
      bgEnabled ? 1 : 0,
      hapticsEnabled ? 1 : 0,
      keyboardSoundEnabled ? 1 : 0,
      theme,
      volume,
    ],
  );
};
