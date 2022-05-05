<script setup lang="ts">
import { SelectOption } from "@/common";

defineProps<{
  modelValue: string;
  options: SelectOption[];
}>();

const emit = defineEmits({
  "update:model-value": (value: string) => true,
});

const onChange = (event: Event) => {
  emit("update:model-value", (event.target as HTMLInputElement)?.value || "");
};
</script>

<template>
  <select :value="modelValue" @change="onChange" class="ui-select">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.ui-select {
  background: none;
  border-color: currentColor;
  color: currentColor;
}
</style>
