import { Shape, ShapeSchema } from "@/Shape";
import { ShapeError } from "@/errors/ShapeError";

describe("Shape", () => {
  test("should return the scheme", () => {
    const { shape, schemaRotate } = createTestShape();
    expect(shape.getSchema()).toEqual(schemaRotate[0]);
    expect(shape.getSize()).toEqual(3);
  });

  test("should throw an error when the schema is wrong", () => {
    const callback = () => {
      createTestShape([
        [0, 1, 0],
        [1, 1, 1],
      ]);
    };

    expect(callback).toThrowError(ShapeError);
  });

  test("should rotate clockwise", () => {
    const { shape, schemaRotate } = createTestShape();

    shape.rotateClockwise();
    expect(shape.getRotateIndex()).toEqual(1);
    expect(shape.getSchema()).toEqual(schemaRotate[1]);

    shape.rotateClockwise();
    expect(shape.getRotateIndex()).toEqual(2);
    expect(shape.getSchema()).toEqual(schemaRotate[2]);

    shape.rotateClockwise();
    expect(shape.getRotateIndex()).toEqual(3);
    expect(shape.getSchema()).toEqual(schemaRotate[3]);

    shape.rotateClockwise();
    expect(shape.getRotateIndex()).toEqual(0);
    expect(shape.getSchema()).toEqual(schemaRotate[0]);
  });

  test("should rotate counter-clockwise", () => {
    const { shape, schemaRotate } = createTestShape();

    shape.rotateCounterClockwise();
    expect(shape.getRotateIndex()).toEqual(3);
    expect(shape.getSchema()).toEqual(schemaRotate[3]);

    shape.rotateCounterClockwise();
    expect(shape.getRotateIndex()).toEqual(2);
    expect(shape.getSchema()).toEqual(schemaRotate[2]);

    shape.rotateCounterClockwise();
    expect(shape.getRotateIndex()).toEqual(1);
    expect(shape.getSchema()).toEqual(schemaRotate[1]);

    shape.rotateCounterClockwise();
    expect(shape.getRotateIndex()).toEqual(0);
    expect(shape.getSchema()).toEqual(schemaRotate[0]);
  });
});

function createTestShape(
  principalSchema: ShapeSchema = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]
) {
  const schemaRotate = [
    [
      [0, 2, 0],
      [2, 2, 2],
      [0, 0, 0],
    ],
    [
      [0, 2, 0],
      [0, 2, 2],
      [0, 2, 0],
    ],
    [
      [0, 0, 0],
      [2, 2, 2],
      [0, 2, 0],
    ],
    [
      [0, 2, 0],
      [2, 2, 0],
      [0, 2, 0],
    ],
  ];
  const shape = new Shape(principalSchema, 2);

  return {
    shape,
    schemaRotate,
  };
}
