<script setup lang="ts">
import AppGame from "@/components/AppGame.vue";
</script>

<template>
  <AppGame />
</template>

<style>
@font-face {
  font-family: Digital;
  src: url(./assets/digital.ttf);
}

:root {
  --color-background: #6f775e;
  --color-inactive: #656f5b;
  --color-active: #000;
}
body {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-active);
  background-color: var(--color-background);
}
body,
html {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
