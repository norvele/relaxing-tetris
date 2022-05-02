import { injectContainer } from "@/container";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { FieldSchema } from "@/GameField";
import { MoveDirection, RotateDirection } from "@/GameField";
import { useKeyboard } from "@/composition/useKeyboard";

enum GameState {
  notStarted,
  played,
  paused,
  ended,
}

interface GameData {
  state: GameState;
}

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
  const config = gameField.getConfig();

  const currentSchema = ref<FieldSchema<string | number>>(
    gameField.getCurrentSchema()
  );
  const tickInterval = ref();
  const gameData = ref<GameData>({
    state: GameState.notStarted,
  });
  const isPlayed = computed(() => gameData.value.state === GameState.played);

  const updateGameFieldState = () => {
    currentSchema.value = gameField.getCurrentSchema();
  };

  const reset = () => {
    gameData.value.state = GameState.notStarted;
    gameField.resetFixedSchema();
    updateGameFieldState();
  };

  const start = () => {
    gameData.value.state = GameState.played;
    gameField.addShape(shapeBuilder.createRandomShape());
  };

  const finish = () => {
    gameData.value.state = GameState.ended;
  };

  const onSpace = () => {
    switch (gameData.value.state) {
      case GameState.paused:
        gameData.value.state = GameState.played;
        break;
      case GameState.played:
        gameData.value.state = GameState.paused;
        break;
      case GameState.ended:
        reset();
        break;
      case GameState.notStarted:
        start();
    }
  };

  const moveShapeDown = () => {
    if (!isPlayed.value) {
      return;
    }
    const isMoveSuccess = gameField.moveShape(MoveDirection.down);
    if (!isMoveSuccess) {
      if (gameField.fixShape()) {
        finish();
      }
      gameField.removeFullyFilledRows();
      gameField.addShape(shapeBuilder.createRandomShape());
    }
    updateGameFieldState();
  };

  const moveShapeLeft = () => {
    if (!isPlayed.value) {
      return;
    }
    gameField.moveShape(MoveDirection.left);
    updateGameFieldState();
  };

  const moveShapeRight = () => {
    if (!isPlayed.value) {
      return;
    }
    gameField.moveShape(MoveDirection.right);
    updateGameFieldState();
  };

  const rotateShape = () => {
    if (!isPlayed.value) {
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
      if (gameData.value.state === GameState.played) {
        moveShapeDown();
      }
    }, 500);
  });

  onBeforeUnmount(() => {
    clearInterval(tickInterval.value);
  });

  return {
    config,
    currentSchema,
  };
}
