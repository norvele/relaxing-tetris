<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  label?: string;
}>();

const emit = defineEmits({
  "update:model-value": (value: boolean) => true,
});

const onChange = (event: Event) => {
  emit(
    "update:model-value",
    (event.target as HTMLInputElement)?.checked || false
  );
};
</script>

<template>
  <label class="ui-checkbox">
    <input
      class="ui-checkbox__input"
      type="checkbox"
      :checked="modelValue"
      @change="onChange"
    />
    <span v-if="label" class="ui-checkbox__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.ui-checkbox {
  display: flex;
  align-items: center;
}

.ui-checkbox__label {
  margin-left: 5px;
}

.ui-checkbox__input {
  width: 20px;
  height: 20px;
}
</style>
