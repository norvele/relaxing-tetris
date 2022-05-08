import { Schema } from "@/common";
import get from "lodash/get";

interface BoundaryBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function sliceMatrix(
  matrix: Schema,
  { x1, y1, x2, y2 }: BoundaryBox,
  outOfBoxItem: unknown = undefined
) {
  const result = [];
  for (let y = y1; y <= y2; y++) {
    const resultRow = [];
    for (let x = x1; x <= x2; x++) {
      const resultValue =
        get(matrix, [y, x]) === undefined ? outOfBoxItem : matrix[y][x];
      resultRow.push(resultValue);
    }
    result.push(resultRow);
  }

  return result;
}
