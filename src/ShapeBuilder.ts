import { Shape, ShapeI } from "@/Shape";
import { getRandomFromArray } from "@/utils/getRandomFromArray";

const defaultShapesMap = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
} as const;
export type DefaultShapeName = keyof typeof defaultShapesMap;
export const defaultShapesNames = Object.keys(
  defaultShapesMap
) as DefaultShapeName[];

export interface ShapeBuilderI {
  createRandomShape(): ShapeI<unknown>;
}

export class ShapeBuilder implements ShapeBuilderI {
  createRandomShape(): ShapeI<DefaultShapeName> {
    const shapeName = getRandomFromArray(defaultShapesNames);
    return new Shape(defaultShapesMap[shapeName], shapeName);
  }
}
