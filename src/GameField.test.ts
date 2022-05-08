import { GameField, MoveDirection, RotateDirection } from "@/GameField";
import { Shape } from "@/Shape";
import { GameError } from "@/errors/GameError";

describe("GameField", () => {
  test("should add, move, check collisions and fix a shape", () => {
    const shape = new Shape(
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      2
    );
    const shape2 = new Shape(
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      3
    );
    const gameField = new GameField({ field: { width: 5, height: 5 } });
    gameField.addShape(shape);
    gameField.moveShape(MoveDirection.down, 3);
    gameField.fixShape();

    expect(gameField.getFixedSchema()).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [0, 2, 2, 2, 0],
      [0, 0, 0, 0, 0],
    ]);

    gameField.addShape(shape2);
    gameField.rotateShape(RotateDirection.clockwise);
    gameField.moveShape(MoveDirection.left, 4); // Check border collision
    gameField.moveShape(MoveDirection.down, 7); // Check other shape collision
    gameField.rotateShape(RotateDirection.clockwise); // Check rotate collision
    gameField.fixShape();

    expect(gameField.getFixedSchema()).toEqual([
      [0, 0, 0, 0, 0],
      [3, 0, 0, 0, 0],
      [3, 3, 2, 0, 0],
      [3, 2, 2, 2, 0],
      [0, 0, 0, 0, 0],
    ]);
  });

  test("should bounce to the right", () => {
    const shape = getRotationShape();
    const gameField = new GameField({ field: { width: 6, height: 5 } });
    gameField.addShape(shape);
    gameField.moveShape(MoveDirection.down, 1);
    gameField.rotateShape(RotateDirection.clockwise);
    gameField.moveShape(MoveDirection.left, 3);
    gameField.rotateShape(RotateDirection.counterClockwise);
    gameField.fixShape();

    expect(gameField.getFixedSchema()).toEqual([
      [0, 0, 0, 0, 0, 0],
      [2, 2, 2, 2, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  test("should bounce to the left", () => {
    const shape = getRotationShape();
    const gameField = new GameField({ field: { width: 6, height: 5 } });
    gameField.addShape(shape);
    gameField.moveShape(MoveDirection.down, 1);
    gameField.rotateShape(RotateDirection.counterClockwise);
    gameField.moveShape(MoveDirection.right, 3);
    gameField.rotateShape(RotateDirection.clockwise);
    gameField.fixShape();

    expect(gameField.getFixedSchema()).toEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 2, 2, 2],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  test("should return fully filled rows", () => {
    const gameField = new GameField({ field: { width: 4, height: 4 } });
    gameField.setFixedSchema([
      [1, 2, 1, 1],
      [1, 1, 2, 3],
      [0, 0, 0, 0],
      [1, 2, 0, 1],
    ]);
    expect(gameField.getFullyFilledRows()).toEqual([0, 1]);
  });

  test("should throw an error when the schema has wrong size", () => {
    const gameField = new GameField({ field: { width: 4, height: 4 } });
    const callback = () => {
      gameField.setFixedSchema([
        [1, 2],
        [1, 1],
      ]);
    };
    expect(callback).toThrowError(GameError);
  });

  test("should remove fully filled rows", () => {
    const gameField = new GameField({ field: { width: 4, height: 4 } });
    gameField.setFixedSchema([
      [1, 0, 1, 1],
      [1, 1, 2, 3],
      [0, 1, 0, 0],
      [1, 2, 2, 1],
    ]);
    gameField.removeFullyFilledRows();
    expect(gameField.getFixedSchema()).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 1, 1],
      [0, 1, 0, 0],
    ]);
  });

  test("should return true then it is overfill", () => {
    const shape = new Shape(
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      2
    );
    const gameField = new GameField({ field: { width: 4, height: 4 } });
    gameField.setFixedSchema([
      [0, 0, 0, 0],
      [1, 1, 0, 3],
      [0, 1, 0, 0],
      [1, 2, 0, 1],
    ]);
    gameField.addShape(shape);
    gameField.moveShape(MoveDirection.down, 3);
    const result = gameField.fixShape();

    expect(result).toEqual(true);
  });

  test("should return false because it isn't overfill", () => {
    const shape = new Shape(
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      2
    );
    const gameField = new GameField({ field: { width: 4, height: 4 } });
    gameField.setFixedSchema([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 2, 0, 1],
    ]);
    gameField.addShape(shape);
    gameField.moveShape(MoveDirection.down, 3);
    const result = gameField.fixShape();

    expect(result).toEqual(false);
  });

  test("should return shape shadow", () => {
    const shape = new Shape(
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      2
    );
    const gameField = new GameField({ field: { width: 5, height: 6 } });
    gameField.setFixedSchema([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 3, 0, 0],
      [0, 2, 3, 0, 0],
      [0, 2, 0, 0, 0],
    ]);
    gameField.addShape(shape);
    gameField.moveShape(MoveDirection.down, 2);

    expect(gameField.getShapeShadowSchema()).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
    ]);
  });
});

function getRotationShape() {
  return new Shape(
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    2
  );
}
