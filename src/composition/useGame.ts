import { injectContainer } from "@/container";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { MoveDirection, RotateDirection } from "@/GameField";
import { useKeyboard } from "@/composition/useKeyboard";
import { useCounterStore } from "@/stores/useGameStore";
import { GameState } from "@/common";

const leftRightConfig = {
  repeat: {
    delay: 150,
    timeout: 150,
  },
};

const downConfig = {
  repeat: {
    delay: 150,
    timeout: 50,
  },
};

export function useGame() {
  const { gameField, shapeBuilder } = injectContainer();
  const { keyboardEventInitiator } = useKeyboard();
  const gameStore = useCounterStore();

  const currentSchema = ref(gameField.getCurrentSchema());
  const tickInterval = ref();
  const animatedRowsIndexes = ref<number[]>([]);

  const updateGameFieldState = () => {
    currentSchema.value = gameField.getCurrentSchema();
  };

  const addShape = () => {
    gameField.addShape(gameStore.nextShape || shapeBuilder.createRandomShape());
    gameStore.setNextShape(shapeBuilder.createRandomShape());
  };

  const reset = () => {
    gameStore.reset();
    gameField.resetFixedSchema();
    updateGameFieldState();
  };

  const start = () => {
    gameStore.start();
    addShape();
  };

  const finish = () => {
    gameStore.finish();
  };

  const onSpace = () => {
    switch (gameStore.state) {
      case GameState.paused:
        gameStore.resume();
        break;
      case GameState.played:
        gameStore.pause();
        break;
      case GameState.ended:
        reset();
        break;
      case GameState.notStarted:
        start();
    }
  };

  const animateFullFilledRows = async (
    rowsIndexes: number[]
  ): Promise<true> => {
    return new Promise((resolve) => {
      gameStore.setTechnicalPause(true);
      animatedRowsIndexes.value = rowsIndexes;
      setTimeout(() => {
        gameStore.setTechnicalPause(false);
        animatedRowsIndexes.value = [];
        resolve(true);
      }, 500);
    });
  };

  const moveShapeDown = async () => {
    if (!gameStore.isPlayed) {
      return;
    }
    const isMoveSuccess = gameField.moveShape(MoveDirection.down);
    if (!isMoveSuccess) {
      if (gameField.fixShape()) {
        finish();
        return;
      }
      const fullyFilledRows = gameField.getFullyFilledRows();
      if (fullyFilledRows.length) {
        await animateFullFilledRows(fullyFilledRows);
        gameStore.incrementScore(fullyFilledRows.length);
        gameField.removeFullyFilledRows();
      }
      addShape();
    }
    updateGameFieldState();
  };

  const moveShapeLeft = () => {
    if (!gameStore.isPlayed) {
      return;
    }
    gameField.moveShape(MoveDirection.left);
    updateGameFieldState();
  };

  const moveShapeRight = () => {
    if (!gameStore.isPlayed) {
      return;
    }
    gameField.moveShape(MoveDirection.right);
    updateGameFieldState();
  };

  const rotateShape = () => {
    if (!gameStore.isPlayed) {
      return;
    }
    gameField.rotateShape(RotateDirection.clockwise);
    updateGameFieldState();
  };

  keyboardEventInitiator.on("ArrowDown", moveShapeDown, downConfig);
  keyboardEventInitiator.on("ArrowLeft", moveShapeLeft, leftRightConfig);
  keyboardEventInitiator.on("ArrowRight", moveShapeRight, leftRightConfig);
  keyboardEventInitiator.on("ArrowUp", rotateShape);
  keyboardEventInitiator.on("Space", onSpace);

  onMounted(() => {
    tickInterval.value = setInterval(() => {
      if (gameStore.isPlayed && !gameStore.isTechnicalPause) {
        moveShapeDown();
      }
    }, 500);
  });

  onBeforeUnmount(() => {
    clearInterval(tickInterval.value);
  });

  return {
    currentSchema,
    animatedRowsIndexes,
    gameStore,
  };
}
