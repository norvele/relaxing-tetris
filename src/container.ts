import { inject } from "vue";
import { GameField, GameFieldI } from "@/GameField";
import { ShapeBuilder, ShapeBuilderI } from "@/ShapeBuilder";
import {
  KeyboardEventInitiator,
  KeyboardEventInitiatorI,
} from "@/KeyboardEventInitiator";

export interface ContainerI {
  gameField: GameFieldI;
  shapeBuilder: ShapeBuilderI;
  keyboardEventInitiator: KeyboardEventInitiatorI;
}

export const containerKey = Symbol("container");

export function injectContainer(): ContainerI {
  return inject(containerKey) as ContainerI;
}

export function createContainer(): ContainerI {
  return {
    gameField: new GameField({ field: { width: 10, height: 20 } }),
    shapeBuilder: new ShapeBuilder(),
    keyboardEventInitiator: new KeyboardEventInitiator(),
  };
}
