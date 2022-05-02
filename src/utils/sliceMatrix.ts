interface BoundaryBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
type Matrix =
  | Array<Array<0 | unknown>>
  | ReadonlyArray<ReadonlyArray<0 | unknown>>;

export function sliceMatrix(
  matrix: Matrix,
  { x1, y1, x2, y2 }: BoundaryBox,
  outOfBoxItem: unknown = undefined
) {
  const result = [];
  for (let y = y1; y <= y2; y++) {
    const resultRow = [];
    for (let x = x1; x <= x2; x++) {
      const resultValue =
        (matrix[y] && matrix[y][x]) === undefined ? outOfBoxItem : matrix[y][x];
      resultRow.push(resultValue);
    }
    result.push(resultRow);
  }

  return result;
}
