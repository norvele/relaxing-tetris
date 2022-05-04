<script setup lang="ts">
import { computed, CSSProperties } from "vue";
import { Schema } from "@/common";

const props = defineProps<{
  cellSize: number;
  dataSchema?: Schema;
  boundarySchema?: Schema;
  animatedRowsIndexes?: number[];
}>();

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
</script>

<template>
  <div class="app-field" :style="customProperties">
    <template v-for="(row, rowIndex) in iterableSchema" :key="rowIndex">
      <div
        class="app-field__cell"
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        :class="{
          _filled: !!getCellValue(cellIndex, rowIndex),
          _animated: isRowAnimated(rowIndex),
        }"
      />
    </template>
  </div>
</template>

<style scoped>
@keyframes blinking {
  0% {
    color: var(--color-inactive);
  }
  49% {
    color: var(--color-inactive);
  }
  50% {
    color: var(--color-active);
  }
  99% {
    color: var(--color-active);
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
  animation: blinking 0.15s infinite;
}
</style>
