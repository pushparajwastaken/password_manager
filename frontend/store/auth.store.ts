import { create } from "zustand";
import { api } from "@/lib/api";
type AuthState = {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  loadUser: async () => {
    try {
      const res = await api.get("/users/currentUser");
      set({
        user: res.data.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    await api.post("/users/logout");
    set({ user: null, isAuthenticated: false });
  },
}));
