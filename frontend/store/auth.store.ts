import { create } from "zustand";
import api from "@/lib/api";

type LoginData = {
  userName: string;
  password: string;
};

type AuthState = {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  login: async (data) => {
    set({ loading: true });
    try {
      await api.post("/users/login", data); // 🍪 cookies set here
      await useAuthStore.getState().loadUser(); // 🔄 fetch user
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

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
