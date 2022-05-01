import { getMatrixCollision } from "@/utils/getMatrixCollision";

const baseMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1],
];

const overlayMatrix = [
  [0, 1, 0],
  [1, 1, 1],
];

describe("getMatrixCollision", () => {
  test("There should be no collision", () => {
    const collision = getMatrixCollision(baseMatrix, {
      matrix: overlayMatrix,
      x: 0,
      y: 1,
    });
    expect(collision.isCollision).toEqual(false);
  });

  test("There should be collision from bottom", () => {
    const { isCollision, leftWeight, rightWeight } = getMatrixCollision(
      baseMatrix,
      {
        matrix: overlayMatrix,
        x: 2,
        y: 1,
      }
    );
    expect(isCollision).toEqual(true);
    expect(leftWeight).toEqual(0);
    expect(rightWeight).toEqual(0);
  });

  test("There should be deep collision from right", () => {
    const { isCollision, leftWeight, rightWeight } = getMatrixCollision(
      baseMatrix,
      {
        matrix: overlayMatrix,
        x: 1,
        y: 2,
      }
    );
    expect(isCollision).toEqual(true);
    expect(leftWeight).toEqual(0);
    expect(rightWeight).toEqual(2);
  });

  test("There should be collision from left", () => {
    const { isCollision, leftWeight, rightWeight } = getMatrixCollision(
      baseMatrix,
      {
        matrix: overlayMatrix,
        x: 3,
        y: 2,
      }
    );
    expect(isCollision).toEqual(true);
    expect(leftWeight).toEqual(1);
    expect(rightWeight).toEqual(0);
  });

  test("There should be collision with border left", () => {
    const { isCollision, leftWeight, rightWeight } = getMatrixCollision(
      baseMatrix,
      {
        matrix: overlayMatrix,
        x: -1,
        y: 0,
      }
    );
    expect(isCollision).toEqual(true);
    expect(leftWeight).toEqual(1);
    expect(rightWeight).toEqual(0);
  });

  test("There should be fatal collision", () => {
    const { isCollision, leftWeight, rightWeight } = getMatrixCollision(
      baseMatrix,
      {
        matrix: overlayMatrix,
        x: -1,
        y: 4,
      }
    );
    expect(isCollision).toEqual(true);
    expect(leftWeight).toEqual(3);
    expect(rightWeight).toEqual(3);
  });
});
