import { create } from "zustand";

import authService from "../services/auth.service";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      token: null,

      signup: async (data) => {
        const response = await authService.signup(data);

        set({
          user: response.user,

          token: response.token,
        });

        return response;
      },

      login: async (data) => {
        const response = await authService.login(data);

        set({
          user: response.user,
          token: response.token,
        });

        return response;
      },

      googleLogin: async (credential) => {
        const response = await authService.googleAuth(credential);

        set({
          user: response.user,
          token: response.token,
        });

        return response;
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout API Error:", error);
        } finally {
          set({
            user: null,

            token: null,
          });
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;
