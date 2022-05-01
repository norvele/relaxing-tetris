<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const root = ref<HTMLElement>();
const isOpened = ref(false);

const close = () => {
  isOpened.value = false;
};
const toggle = () => {
  isOpened.value = !isOpened.value;
};
const clickListener = (event: Event) => {
  if (!root.value?.contains(event.target as HTMLElement)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", clickListener);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", clickListener);
});
</script>

<template>
  <div class="ui-dropdown" ref="root">
    <div class="ui-dropdown__trigger" @click="toggle">
      <slot name="trigger" />
    </div>
    <div v-if="isOpened" class="ui-dropdown__body">
      <slot name="body" />
    </div>
  </div>
</template>

<style scoped>
.ui-dropdown {
  position: relative;
}

.ui-dropdown__body {
  position: absolute;
  background-color: #fff;
  border: 1px solid #000;
  transform: translateY(-1px);
  padding: 10px;
}
</style>
