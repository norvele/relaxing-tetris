import { defineStore } from "pinia";
import { Theme } from "@/common";

const themeKey = "theme";

export const useAppStore = defineStore("appStore", {
  state: () => ({
    theme: (localStorage.getItem(themeKey) as Theme) || Theme.lcd,
  }),
  actions: {
    setTheme(value: Theme) {
      this.theme = value;
      localStorage.setItem(themeKey, value);
    },
  },
});
