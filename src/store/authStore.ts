import { defineStore } from "pinia";
import { api } from "@/composables/useApi";
import { enuStorageKey, storage } from "@/composables/useStorage";

type AuthState = {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
};

interface IntTokens {
  access: string;
  refresh: string;
}
export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    isLoggedIn: false,
    isLoading: false,
    error: null,
  }),

  actions: {
    decodeJWT(token: string) {
      try {
        const parts = token.split(".");
        if (parts.length !== 3) {
          return null;
        }

        const payload = atob(parts[1]);
        return JSON.parse(payload);
      } catch (e) {
        console.error("Invalid JWT:", e);
        return null;
      }
    },
    setUserInfo(info: { access: string; refresh: string }) {
      storage.set({ key: enuStorageKey.accessToken, value: info.access });
      storage.set({
        key: enuStorageKey.refreshToken,
        value: info.refresh,
      });
      this.isLoggedIn = true;
    },
    async refreshToken() {},
    async registerUser(payload: {
      email: string;
      password: string;
    }): Promise<unknown> {
      this.isLoading = true;
      this.error = null;

      try {
        const response: any = await api.post("signup", payload, false);

        const { access, refresh } = response.data as IntTokens;
        this.setUserInfo({ access, refresh });

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
        const response: any = await api.post("login", payload, false);
        const { access, refresh } = response.data as IntTokens;

        this.setUserInfo({ access, refresh });
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
      this.isLoggedIn = false;
    },
  },
});
