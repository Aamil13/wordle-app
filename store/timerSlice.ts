import { StateCreator } from "zustand";

export type TimerSlice = {
  lastTriggeredAt: number | null;
  setLastTriggeredAt: (time: number) => void;
};

export const createTimerSlice: StateCreator<TimerSlice, [], [], TimerSlice> = (
  set,
) => ({
  lastTriggeredAt: null,
  setLastTriggeredAt: (time) => set({ lastTriggeredAt: time }),
});
