import { sumMatrix } from "@/utils/sumMatrix";

const testMatrix = [
  [0, 0, 0],
  [1, 0, 1],
  [3, 0, 0],
];

describe("sumMatrix", () => {
  test("should return summary matrix", () => {
    const matrix = [
      [2, 2, 2],
      [0, 2, 0],
      [0, 0, 0],
    ];
    const result = sumMatrix(testMatrix, { x: 0, y: 0, matrix });
    expect(result).toEqual([
      [2, 2, 2],
      [1, 2, 1],
      [3, 0, 0],
    ]);
  });

  test("should return summary matrix with offset", () => {
    const matrix = [
      [2, 2, 0],
      [2, 2, 0],
      [0, 0, 0],
    ];
    const result = sumMatrix(testMatrix, { x: 1, y: 1, matrix });
    expect(result).toEqual([
      [0, 0, 0],
      [1, 2, 2],
      [3, 2, 2],
    ]);
  });

  test("should return summary matrix with offsets the boundaries", () => {
    const matrix = [
      [2, 2, 0],
      [2, 2, 0],
      [0, 0, 0],
    ];
    const result = sumMatrix(testMatrix, { x: 2, y: 0, matrix });
    expect(result).toEqual([
      [0, 0, 2],
      [1, 0, 2],
      [3, 0, 0],
    ]);
  });
});
