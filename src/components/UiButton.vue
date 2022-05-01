<script setup lang="ts">
const emit = defineEmits({
  click: () => true,
});

const onClick = () => {
  emit("click");
};
</script>

<template>
  <button class="ui-button" type="button" @click="onClick">
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  font-size: 24px;
}
</style>
