import { defineStore } from "pinia";
import { ShapeI } from "@/Shape";
import { GameState } from "@/common";

export const useCounterStore = defineStore("gameStore", {
  state: () => ({
    state: GameState.notStarted,
    score: 0,
    isTechnicalPause: false,
    nextShape: undefined as ShapeI | undefined,
  }),
  getters: {
    isPlayed: (state) => state.state === GameState.played,
  },
  actions: {
    start() {
      this.state = GameState.played;
    },
    pause() {
      this.state = GameState.paused;
    },
    resume() {
      this.state = GameState.played;
    },
    finish() {
      this.state = GameState.ended;
      this.nextShape = undefined;
    },
    reset() {
      this.state = GameState.notStarted;
      this.score = 0;
      this.isTechnicalPause = false;
      this.nextShape = undefined;
    },
    setNextShape(shape: ShapeI) {
      this.nextShape = shape;
    },
    setTechnicalPause(value: boolean) {
      this.isTechnicalPause = value;
    },
    incrementScore(value: number) {
      this.score += value;
    },
  },
});
