// store/index.ts

import { create } from "zustand";
import { createSettingsSlice, SettingsSlice } from "./settingsSlice";
import { createTimerSlice, TimerSlice } from "./timerSlice";
import { createAuthSlice, AuthSlice } from "./userSlice";

type StoreState = SettingsSlice & TimerSlice & AuthSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createSettingsSlice(...a),
  ...createTimerSlice(...a),
  ...createAuthSlice(...a),
}));
