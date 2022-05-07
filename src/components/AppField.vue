<script setup lang="ts">
import { computed, CSSProperties } from "vue";
import { Schema, Theme } from "@/common";
import { useAppStore } from "@/stores/useAppStore";
import { DefaultShapeName } from "@/ShapeBuilder";

const appStore = useAppStore();

const props = defineProps<{
  cellSize: number;
  dataSchema?: Schema;
  boundarySchema?: Schema;
  animatedRowsIndexes?: number[];
}>();

const colorsMap: Record<DefaultShapeName, string> = {
  I: "#a2d497",
  J: "#1a3d58",
  L: "#d8b998",
  O: "#ffde4c",
  S: "#0cada5",
  Z: "#89687a",
  T: "#fe6d41",
};

const iterableSchema = computed(
  () => props.boundarySchema || props.dataSchema || [[]]
);

const fieldSize = computed(() => ({
  width: iterableSchema.value[0].length,
  height: iterableSchema.value.length,
}));

const isRowAnimated = (index: number) => {
  if (!props.animatedRowsIndexes) {
    return false;
  }
  return props.animatedRowsIndexes.includes(index);
};

const getCellValue = (x: number, y: number) => {
  return (
    (props.dataSchema && props.dataSchema[y] && props.dataSchema[y][x]) || 0
  );
};

const sizes = computed(() => {
  return {
    cell: props.cellSize,
    gap: 2,
    border: 2,
  };
});

const customProperties = computed(
  () =>
    ({
      "--field-rows": fieldSize.value.height,
      "--field-columns": fieldSize.value.width,
      "--field-cell-size": `${sizes.value.cell}px`,
      "--field-gap-size": `${sizes.value.gap}px`,
      "--field-border-size": `${sizes.value.border}px`,
    } as CSSProperties)
);

const getCellStyles = (x: number, y: number) => {
  if (appStore.theme === Theme.color) {
    return {
      color: colorsMap[getCellValue(x, y) as DefaultShapeName],
    };
  }
  return {};
};
</script>

<template>
  <div
    class="app-field"
    :class="`__theme-${appStore.theme}`"
    :style="customProperties"
  >
    <template v-for="(row, rowIndex) in iterableSchema" :key="rowIndex">
      <div
        class="app-field__cell"
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        :class="{
          _filled: !!getCellValue(cellIndex, rowIndex),
          _animated: isRowAnimated(rowIndex),
        }"
        :style="getCellStyles(cellIndex, rowIndex)"
      />
    </template>
  </div>
</template>

<style scoped>
@keyframes blinking {
  50% {
    color: var(--color-inactive);
  }
  99% {
    color: var(--color-inactive);
  }
}

.app-field {
  --field-rows: 0;
  --field-columns: 0;
  --field-cell-size: 0;
  --field-gap-size: 0;
  --field-border-size: 0;

  text-align: left;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: repeat(var(--field-rows), var(--field-cell-size));
  grid-template-columns: repeat(var(--field-columns), var(--field-cell-size));
}

.app-field__cell {
  position: relative;
  /*border: var(--field-border-size) solid currentColor;*/
  color: var(--color-inactive);
  /*transition: color 0.1s;*/
}

.app-field__cell::before {
  box-sizing: border-box;
  content: "";
  position: absolute;
  width: calc(100% - var(--field-gap-size) * 2);
  height: calc(100% - var(--field-gap-size) * 2);
  transform: translate(var(--field-gap-size), var(--field-gap-size));
  border: var(--field-border-size) solid currentColor;
  padding: var(--field-border-size);
  background-clip: content-box;
  background-color: currentColor;
}

.app-field__cell._filled {
  color: var(--color-active);
}

.app-field__cell._animated {
  animation: blinking 0.15s steps(2) infinite;
}

.app-field.__theme-color .app-field__cell::before {
  padding: 0;
  border: 0;
  border-radius: 4px;
}
</style>
