import type { ShapeI } from "@/Shape";
import { GameError, GameErrorCode } from "@/errors/GameError";
import { getMatrixCollision } from "@/utils/getMatrixCollision";

export type FieldSchema<T = 1> = Array<Array<0 | T>>;

type ShapeSymbol = string | number;

export interface GameFieldConfig {
  field: {
    width: number;
    height: number;
  };
}

export interface CurrentShape {
  x: number;
  y: number;
  shape: ShapeI<ShapeSymbol>;
}

export enum MoveDirection {
  down,
  left,
  right,
}

export enum RotateDirection {
  clockwise,
  counterClockwise,
}

interface ShapeCollision {
  isCollision: boolean;
  leftWeight: number;
  rightWeight: number;
}

export interface GameFieldI {
  getConfig(): GameFieldConfig;
  getCurrentShape(): CurrentShape | undefined;
  addShape(shape: ShapeI<unknown>): void;
  moveShape(direction: MoveDirection): boolean;
  rotateShape(direction: RotateDirection): boolean;
  fixShape(): boolean;
  getCurrentSchema(): FieldSchema<ShapeSymbol>;
  getFixedSchema(): FieldSchema<ShapeSymbol>;
  setFixedSchema(schema: FieldSchema<ShapeSymbol>): void;
  resetFixedSchema(): void;
  getFullyFilledRows(): number[];
  removeFullyFilledRows(): void;
}

export class GameField implements GameFieldI {
  protected config: GameFieldConfig;
  protected fixedSchema: FieldSchema<ShapeSymbol>;
  protected currentShape: CurrentShape | undefined;

  constructor(config: GameFieldConfig) {
    this.config = config;
    this.fixedSchema = this.createEmptySchema(
      config.field.width,
      config.field.height
    );
  }

  public getConfig(): GameFieldConfig {
    return this.config;
  }

  public getCurrentShape(): CurrentShape | undefined {
    return this.currentShape;
  }

  public addShape(shape: ShapeI<ShapeSymbol>) {
    if (this.currentShape) {
      throw new GameError(
        "The shape must be one on the field",
        GameErrorCode.shapeMustBeOne
      );
    }
    const x = Math.floor(this.config.field.width / 2 - shape.getSize() / 2);
    const y = -shape.getSize();
    this.currentShape = { x, y, shape: shape };
  }

  public moveShape(direction: MoveDirection, times = 1) {
    for (let i = 0; i < times; i++) {
      if (!this.moveShape1time(direction)) {
        return false;
      }
    }
    return true;
  }

  public rotateShape(direction: RotateDirection): boolean {
    if (!this.currentShape) {
      throw this.getNoShapeError();
    }
    const { shape, x, y } = this.currentShape;
    let doRotate;
    let undoRotate;
    switch (direction) {
      case RotateDirection.clockwise:
        doRotate = shape.rotateClockwise;
        undoRotate = shape.rotateCounterClockwise;
        break;
      case RotateDirection.counterClockwise:
        doRotate = shape.rotateCounterClockwise;
        undoRotate = shape.rotateClockwise;
        break;
    }
    doRotate.call(shape);
    const collision = this.getCollision(shape, x, y);
    if (!collision.isCollision) {
      return true;
    }
    if (collision.leftWeight && collision.rightWeight) {
      undoRotate.call(shape);
      return false;
    }
    if (collision.leftWeight) {
      if (this.getCollision(shape, x + collision.leftWeight, y).isCollision) {
        undoRotate.call(shape);
        return false;
      }
      this.currentShape.x += collision.leftWeight;
      return true;
    }
    if (collision.rightWeight) {
      if (this.getCollision(shape, x - collision.rightWeight, y).isCollision) {
        undoRotate.call(shape);
        return false;
      }
      this.currentShape.x -= collision.rightWeight;
      return true;
    }
    undoRotate.call(shape);
    return false;
  }

  public fixShape() {
    if (!this.currentShape) {
      throw this.getNoShapeError();
    }
    let isOverFill = false;
    if (
      this.getCollision(
        this.currentShape.shape,
        this.currentShape.x,
        this.currentShape.y,
        false
      ).isCollision
    ) {
      isOverFill = true;
    }
    this.fixedSchema = this.getCurrentSchema();
    this.currentShape = undefined;
    return isOverFill;
  }

  public getCurrentSchema(): FieldSchema<ShapeSymbol> {
    if (!this.currentShape) {
      return this.getFixedSchema();
    }
    const fixedSchemaClone = JSON.parse(
      JSON.stringify(this.fixedSchema)
    ) as FieldSchema<ShapeSymbol>;

    const { x, y, shape } = this.currentShape;
    shape.getSchema().forEach((shapeRow, shapeSchemaY) => {
      shapeRow.forEach((shapeCell, shapeSchemaX) => {
        const fieldX = x + shapeSchemaX;
        const fieldY = y + shapeSchemaY;
        if (
          fieldX >= 0 &&
          fieldX < this.config.field.width &&
          fieldY >= 0 &&
          fieldY < this.config.field.height &&
          shapeCell !== 0
        ) {
          fixedSchemaClone[fieldY][fieldX] = shapeCell;
        }
      });
    });
    return fixedSchemaClone;
  }

  public getFixedSchema(): FieldSchema<ShapeSymbol> {
    return this.fixedSchema;
  }

  public setFixedSchema(schema: FieldSchema<ShapeSymbol>) {
    if (!this.guardSchemaSize(schema)) {
      throw new GameError(
        "Schema size is wrong",
        GameErrorCode.wrongSchemaSize
      );
    }
    this.fixedSchema = schema;
  }

  public resetFixedSchema() {
    this.fixedSchema = this.createEmptySchema(
      this.config.field.width,
      this.config.field.height
    );
  }

  public getFullyFilledRows() {
    const rows = [] as number[];
    this.fixedSchema.forEach((row, index) => {
      const isFull = row.every((cell) => cell !== 0);
      if (isFull) {
        rows.push(index);
      }
    });
    return rows;
  }

  public removeFullyFilledRows() {
    const rowsIndexes = this.getFullyFilledRows();
    const compensation = rowsIndexes.map(() =>
      Array(this.config.field.width).fill(0)
    );
    const cleanedSchema = this.fixedSchema.filter(
      (row, index) => !rowsIndexes.includes(index)
    );
    this.fixedSchema = [...compensation, ...cleanedSchema];
  }

  protected moveShape1time(direction: MoveDirection): boolean {
    if (!this.currentShape) {
      throw this.getNoShapeError();
    }
    let dx = 0;
    let dy = 0;
    switch (direction) {
      case MoveDirection.down:
        dy++;
        break;
      case MoveDirection.left:
        dx--;
        break;
      case MoveDirection.right:
        dx++;
        break;
    }
    if (
      this.getCollision(
        this.currentShape.shape,
        this.currentShape.x + dx,
        this.currentShape.y + dy
      ).isCollision
    ) {
      return false;
    }
    this.currentShape.x += dx;
    this.currentShape.y += dy;
    return true;
  }

  protected getCollision(
    shape: ShapeI<ShapeSymbol>,
    x: number,
    y: number,
    withSafeArea = true
  ): ShapeCollision {
    const shapeSize = shape.getSize();
    const safeSpawnArea = withSafeArea
      ? this.createEmptySchema(this.config.field.width, shapeSize)
      : [];
    const safeScheme = [...safeSpawnArea, ...this.fixedSchema];
    return getMatrixCollision(safeScheme, {
      matrix: shape.getSchema(),
      x,
      y: y + safeSpawnArea.length,
    });
  }

  protected createEmptySchema(width: number, height: number): FieldSchema<0> {
    return Array(height)
      .fill([])
      .map(() => Array(width).fill(0));
  }

  protected getNoShapeError() {
    return new GameError("There is no shape", GameErrorCode.noShape);
  }

  protected guardSchemaSize(schema: FieldSchema<ShapeSymbol>) {
    if (schema.length !== this.config.field.height) {
      return false;
    }
    return schema.every((row) => row.length === this.config.field.width);
  }
}
