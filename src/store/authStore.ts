import { defineStore } from "pinia";
import { api } from "@/composables/useApi";
import { enuStorageKey, storage } from "@/composables/useStorage";

type User = {
  id: number;
  email: string;
};

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
  }),

  actions: {
    async registerUser(payload: {
      email: string;
      password: string;
    }): Promise<unknown> {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.post("signup", payload, undefined, false);
        const { user, access_token, refresh_token } = response as {
          user: User;
          access_token: string;
          refresh_token: string;
        };

        storage.set({ key: enuStorageKey.accessToken, value: access_token });
        storage.set({ key: enuStorageKey.refreshToken, value: refresh_token });
        this.user = user;
        this.isLoggedIn = true;

        return response;
      } catch (err: any) {
        this.error = err.message || "Registration failed.";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async loginUser(payload: { email: string; password: string }) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.post("login", payload, undefined, false);
        const { user, access_token, refresh_token } = response as {
          user: User;
          access_token: string;
          refresh_token: string;
        };

        storage.set({ key: enuStorageKey.accessToken, value: access_token });
        storage.set({ key: enuStorageKey.refreshToken, value: refresh_token });
        this.user = user;
        this.isLoggedIn = true;
        return response;
      } catch (err: any) {
        this.error = err.message || "Login failed.";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    logoutUser() {
      storage.remove(enuStorageKey.accessToken);
      storage.remove(enuStorageKey.refreshToken);
      this.user = null;
      this.isLoggedIn = false;
    },
  },
});
