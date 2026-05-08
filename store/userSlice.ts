import { StateCreator } from "zustand";

export type User = {
  id: string;
  email: string;
  userName: string;
  avatar: string | null;
  provider: string;
  lastLoginAt: string;
  stats: Record<string, any>;
};

export type AuthSlice = {
  user: User | null;
  isAuthenticated: boolean;

  setAuth: (data: { user: User }) => void;
  clearAuth: () => void;
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set,
) => ({
  user: null,
  isAuthenticated: false,

  setAuth: ({ user }) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
});
