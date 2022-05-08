<script setup lang="ts">
import AppGame from "@/components/AppGame.vue";
import { useAppStore } from "@/stores/useAppStore";
import UiSelect from "@/components/UiSelect.vue";
import { Theme } from "@/common";

const appStore = useAppStore();
const themeOptions = Object.values(Theme).map((value) => ({
  value,
  label: value,
}));

const setTheme = (theme: string) => {
  appStore.setTheme(theme as Theme);
};
</script>

<template>
  <div class="app-root" :class="`__theme-${appStore.theme}`">
    <div class="app-inner">
      <UiSelect
        class="theme-select"
        :model-value="appStore.theme"
        @update:model-value="setTheme"
        :options="themeOptions"
      />
      <AppGame />
    </div>
  </div>
</template>

<style>
@font-face {
  font-family: Digital;
  src: url(./assets/digital.ttf);
}

@font-face {
  font-family: DisposableDroidBB;
  src: url(./assets/DisposableDroidBB.ttf);
}

:root {
  --color-background: #6f775e;
  --color-inactive: #656f5b;
  --color-shadow: #656f5b;
  --color-active: #000;
}
body {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body,
html {
  margin: 0;
  padding: 0;
}

.app-root {
  color: var(--color-active);
  background-color: var(--color-background);
}

.app-inner {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-root.__theme-crt {
  --color-background: #516c4f;
  --color-inactive: transparent;
  --color-shadow: transparent;
  --color-active: #c1ffbb;

  font-family: DisposableDroidBB, sans-serif;
  background: radial-gradient(
    circle,
    rgb(103 126 101) 0%,
    rgb(79 96 78) 50%,
    rgba(30, 35, 30, 1) 100%
  );
}

.app-root.__theme-crt::after {
  content: "";
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0,
    transparent,
    transparent 2px,
    var(--color-active) 2px,
    var(--color-active) 4px
  );
  opacity: 0.2;
  mix-blend-mode: overlay;
}

.app-root.__theme-crt > .app-inner {
  filter: drop-shadow(0 0 10px currentColor);
}

.app-root.__theme-color {
  --color-background: #ffffff;
  --color-inactive: #f2f2f2;
  --color-shadow: #e1e1e1;
  --color-active: #1a3d58;
}

.theme-select {
  position: absolute;
  top: 5px;
  left: 5px;
}
</style>
