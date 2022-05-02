import { injectContainer } from "@/container";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { MoveDirection, RotateDirection } from "@/GameField";
import { useKeyboard } from "@/composition/useKeyboard";
import { ShapeI } from "@/Shape";

export enum GameState {
  notStarted,
  played,
  paused,
  ended,
}

interface GameData {
  state: GameState;
  score: number;
  isTechnicalPause: boolean;
  nextShape: ShapeI | undefined;
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

  const currentSchema = ref(gameField.getCurrentSchema());
  const tickInterval = ref();
  const gameData = ref<GameData>({
    state: GameState.notStarted,
    score: 0,
    isTechnicalPause: false,
    nextShape: undefined,
  });
  const animatedRowsIndexes = ref<number[]>([]);
  const isPlayed = computed(() => gameData.value.state === GameState.played);

  const updateGameFieldState = () => {
    currentSchema.value = gameField.getCurrentSchema();
  };

  const addShape = () => {
    gameField.addShape(
      gameData.value.nextShape || shapeBuilder.createRandomShape()
    );
    gameData.value.nextShape = shapeBuilder.createRandomShape();
  };

  const reset = () => {
    gameData.value.state = GameState.notStarted;
    gameData.value.score = 0;
    gameData.value.nextShape = undefined;
    gameField.resetFixedSchema();
    updateGameFieldState();
  };

  const start = () => {
    gameData.value.state = GameState.played;
    addShape();
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

  const animateFullFilledRows = async (
    rowsIndexes: number[]
  ): Promise<true> => {
    return new Promise((resolve) => {
      gameData.value.isTechnicalPause = true;
      animatedRowsIndexes.value = rowsIndexes;
      setTimeout(() => {
        gameData.value.isTechnicalPause = false;
        animatedRowsIndexes.value = [];
        resolve(true);
      }, 500);
    });
  };

  const moveShapeDown = async () => {
    if (!isPlayed.value) {
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
        gameData.value.score += fullyFilledRows.length;
        gameField.removeFullyFilledRows();
      }
      addShape();
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
      if (
        gameData.value.state === GameState.played &&
        !gameData.value.isTechnicalPause
      ) {
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
    gameData,
  };
}
