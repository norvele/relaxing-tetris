import { sliceMatrix } from "@/utils/sliceMatrix";

const testMatrix = [
  [0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 0, 1],
  [2, 3, 4, 5, 6, 7],
  [8, 9, 0, 1, 2, 3],
  [4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5],
];

describe("sliceMatrix", () => {
  test("should slice inside", () => {
    const result = sliceMatrix(testMatrix, { x1: 2, y1: 1, x2: 4, y2: 3 });
    expect(result).toEqual([
      [8, 9, 0],
      [4, 5, 6],
      [0, 1, 2],
    ]);
  });

  test("should slice outside top left", () => {
    const result = sliceMatrix(
      testMatrix,
      { x1: -1, y1: -1, x2: 1, y2: 1 },
      "#"
    );
    expect(result).toEqual([
      ["#", "#", "#"],
      ["#", 0, 1],
      ["#", 6, 7],
    ]);
  });

  test("should slice outside bottom right", () => {
    const result = sliceMatrix(testMatrix, { x1: 5, y1: 5, x2: 6, y2: 6 }, "#");
    expect(result).toEqual([
      [5, "#"],
      ["#", "#"],
    ]);
  });
});
