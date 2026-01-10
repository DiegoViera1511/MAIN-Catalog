import { ref } from "vue";
import { defineStore } from "pinia";
import type { Session } from "@supabase/supabase-js";

export const useUserAuthStore = defineStore("user", () => {
  const isAuthenticated = ref(true);
  const loading = ref(false);
  const session = ref<Session | null>(null);

  function login(token: string) {
    localStorage.setItem("jwt", token);
    isAuthenticated.value = true;
  }

  const checkAuth = () => {
    const token = localStorage.getItem("jwt");
    isAuthenticated.value = !!token;
    return isAuthenticated.value;
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    isAuthenticated.value = false;
  };

  return { isAuthenticated, login, checkAuth, logout, loading, session };
});
