// store/settingsSlice.ts

import { StateCreator } from "zustand";

export type SettingsSlice = {
  bgEnabled: boolean;
  hapticsEnabled: boolean;
  volume: number;
  keyboardSoundEnabled: boolean;
  togglekeyboardSound: () => void;

  streak: number;
  bestStreak: number;

  setBgEnabled: (value: boolean) => void;
  toggleBg: () => void;

  setHapticsEnabled: (value: boolean) => void;
  toggleHaptics: () => void;

  setVolume: (value: number) => void;

  setStreak: (value: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;

  theme: "dark" | "light";
  toggleTheme: () => void;

  isHydrated: boolean;
  setHydrated: (value: boolean) => void;
  hydrateFromDb: (data: Partial<SettingsSlice>) => void;
};

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  bgEnabled: true,
  hapticsEnabled: true,
  keyboardSoundEnabled: true,
  volume: 0.5,
  theme: "dark",
  streak: 0,
  bestStreak: 0,

  setBgEnabled: (value) => set({ bgEnabled: value }),
  toggleBg: () => set((state) => ({ bgEnabled: !state.bgEnabled })),

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  togglekeyboardSound: () =>
    set((state) => ({ keyboardSoundEnabled: !state.keyboardSoundEnabled })),

  setHapticsEnabled: (value) => set({ hapticsEnabled: value }),
  toggleHaptics: () =>
    set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),

  setVolume: (value) => set({ volume: Math.max(0, Math.min(1, value)) }),

  setStreak: (value) => set({ streak: value }),

  incrementStreak: () => {
    const newStreak = get().streak + 1;
    const best = Math.max(newStreak, get().bestStreak);

    set({
      streak: newStreak,
      bestStreak: best,
    });
  },

  resetStreak: () => set({ streak: 0 }),

  isHydrated: false,
  setHydrated: (value: boolean) => set({ isHydrated: value }),
  hydrateFromDb: (data) => set({ ...data }),
});
