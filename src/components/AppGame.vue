<script setup lang="ts">
import { useGame, GameState } from "@/composition/useGame";
import AppField from "@/components/AppField.vue";
import { computed, CSSProperties } from "vue";
import AppNumber from "@/components/AppNumber.vue";

const shapeBoundarySchema = Array(4)
  .fill(0)
  .map(() => Array(4).fill(0));

const { currentSchema, animatedRowsIndexes, gameData } = useGame();

const nextShapeSchema = computed(() => gameData.value.nextShape?.getSchema());

const cellSize = 24; // Should be divide on 2

const customProperties = computed(
  () =>
    ({
      "--field-cell-size": `${cellSize}px`,
    } as CSSProperties)
);
</script>

<template>
  <div class="app-game" :style="customProperties">
    <div class="app-game__main">
      <AppField
        class="main-field"
        :data-schema="currentSchema"
        :animated-rows-indexes="animatedRowsIndexes"
        :cell-size="cellSize"
      />
    </div>
    <div class="app-game__sidebar sidebar">
      <div class="sidebar__top">
        <div>Score:</div>
        <AppNumber :value="gameData.score" />
      </div>
      <AppField
        class="shape-field"
        :data-schema="nextShapeSchema"
        :boundary-schema="shapeBoundarySchema"
        :cell-size="cellSize"
      />
      <div>
        <div
          class="state"
          :class="{ _active: gameData.state === GameState.notStarted }"
        >
          Press space<br />to start
        </div>
        <div
          class="state"
          :class="{ _animated: gameData.state === GameState.paused }"
        >
          Pause
        </div>
        <div
          class="state"
          :class="{ _active: gameData.state === GameState.ended }"
        >
          Game Over
        </div>
      </div>
    </div>
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

.app-game {
  --field-cell-size: 0;

  display: flex;
  justify-content: center;
  padding: 4px;
}

.app-game__sidebar {
  text-align: right;
  padding-top: 8px;
}

.main-field {
  font-size: 4px;
  padding: 4px;
  border: 4px solid var(--color-active);
  margin-right: 4px;
}

.shape-field {
  margin-bottom: 20px;
}

.sidebar__top {
  height: calc(var(--field-cell-size) * 3);
}

.state {
  color: var(--color-inactive);
  margin-bottom: 4px;
}

.state._active {
  color: var(--color-active);
}

.state._animated {
  animation: blinking 1s infinite;
}
</style>
