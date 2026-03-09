// store/index.ts

import { create } from "zustand";
import { createSettingsSlice, SettingsSlice } from "./settingsSlice";

type StoreState = SettingsSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createSettingsSlice(...a),
}));
