<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value?: number;
  maxLength?: number;
}>();

const placeholder = computed(() => {
  const maxLength = props.maxLength || 6;
  return Array(maxLength).fill(8).join("");
});
</script>

<template>
  <div class="app-number">
    <div class="app-number__placeholder">{{ placeholder }}</div>
    <div class="app-number__number">{{ value }}</div>
  </div>
</template>

<style scoped>
.app-number {
  font-family: Digital, Helvetica, Arial, sans-serif;
  font-size: 36px;
  position: relative;
  text-align: right;
}

.app-number__placeholder {
  color: var(--color-inactive);
}

.app-number__number {
  position: absolute;
  top: 0;
  right: 0;
  color: var(--color-active);
}
</style>
