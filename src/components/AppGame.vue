<script setup lang="ts">
import { useGame } from "@/composition/useGame";

const { currentSchema, config } = useGame();
</script>

<template>
  <div class="app-game">
    <div
      class="field"
      :style="{
        '--field-rows': config.field.height,
        '--field-columns': config.field.width,
      }"
    >
      <template v-for="(row, rowIndex) in currentSchema" :key="rowIndex">
        <div
          class="field__cell"
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="{ _filled: !!cell }"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.app-game {
  display: flex;
  align-items: center;
  justify-content: center;
}

.field {
  box-sizing: border-box;
  font-size: 4px;
  display: grid;
  grid-gap: 1em;
  grid-template-rows: repeat(var(--field-rows), 1fr);
  grid-template-columns: repeat(var(--field-columns), 1fr);
  height: 100vh;
  width: 50vh;
  padding: 1em;
  border: 1em solid var(--color-active);
}

.field__cell {
  position: relative;
  border: 1em solid currentColor;
  color: var(--color-inactive);
  /*transition: color 0.1s;*/
}

.field__cell::before {
  content: "";
  position: absolute;
  width: calc(100% - 2em);
  height: calc(100% - 2em);
  transform: translate(1em, 1em);
  background-color: currentColor;
}

.field__cell._filled {
  color: var(--color-active);
}
</style>
