import type { ShapeI } from "@/Shape";
import { GameError, GameErrorCode } from "@/errors/GameError";
import { getMatrixCollision } from "@/utils/getMatrixCollision";
import type { Schema, MutableSchema } from "@/common";
import { sumMatrix } from "@/utils/sumMatrix";
import { sliceMatrix } from "@/utils/sliceMatrix";
import get from "lodash/get";

export interface GameFieldConfig {
  field: {
    width: number;
    height: number;
  };
}

export interface CurrentShape {
  x: number;
  y: number;
  shape: ShapeI;
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
  addShape(shape: ShapeI): void;
  moveShape(direction: MoveDirection): boolean;
  rotateShape(direction: RotateDirection): boolean;
  fixShape(): boolean;
  getCurrentSchema(): Schema;
  getFixedSchema(): Schema;
  setFixedSchema(schema: Schema): void;
  resetFixedSchema(): void;
  getFullyFilledRows(): number[];
  removeFullyFilledRows(): void;
  getShapeShadowSchema(): Schema;
}

export class GameField implements GameFieldI {
  protected config: GameFieldConfig;
  protected fixedSchema: Schema;
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

  public addShape(shape: ShapeI) {
    if (this.currentShape) {
      throw new GameError(
        "The shape must be one on the field",
        GameErrorCode.shapeMustBeOne
      );
    }
    const shapeSchema = shape.getSchema();
    let endingEmptyLines = 0;
    for (let i = shapeSchema.length - 1; i > 0; i--) {
      if (shapeSchema[i].some((item) => item)) {
        break;
      }
      endingEmptyLines++;
    }
    const x = Math.floor(this.config.field.width / 2 - shape.getSize() / 2);
    const y = -shape.getSize() + endingEmptyLines + 1;
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

  public getCurrentSchema(): Schema {
    if (!this.currentShape) {
      return this.getFixedSchema();
    }

    const { x, y, shape } = this.currentShape;
    return sumMatrix(this.getFixedSchema(), {
      x,
      y,
      matrix: shape.getSchema(),
    });
  }

  public getFixedSchema(): Schema {
    return this.fixedSchema;
  }

  public setFixedSchema(schema: Schema) {
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

  public getShapeShadowSchema() {
    const schema = this.createEmptySchema(
      this.config.field.width,
      this.config.field.height
    );
    const currentShape = this.currentShape;
    if (!currentShape) {
      return schema;
    }
    const shapeSchema = currentShape.shape.getSchema();
    const slicedFixedSchema = sliceMatrix(this.getFixedSchema(), {
      x1: currentShape.x,
      y1: currentShape.y,
      x2: currentShape.x + currentShape.shape.getSize() - 1,
      y2: this.config.field.height - 1,
    });
    const shadedCells = {} as Record<number, boolean>;
    slicedFixedSchema.forEach((row, y) => {
      row.forEach((cell, x) => {
        const shapeCell = get(shapeSchema, [y, x], 0);
        if (shapeCell !== 0) {
          shadedCells[x] = true;
          return;
        }
        if (cell) {
          shadedCells[x] = false;
          return;
        }
        if (shadedCells[x]) {
          schema[currentShape.y + y][currentShape.x + x] = 1;
        }
      });
    });
    return schema;
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
    shape: ShapeI,
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

  protected createEmptySchema(width: number, height: number): MutableSchema {
    return Array(height)
      .fill([])
      .map(() => Array(width).fill(0));
  }

  protected getNoShapeError() {
    return new GameError("There is no shape", GameErrorCode.noShape);
  }

  protected guardSchemaSize(schema: Schema) {
    if (schema.length !== this.config.field.height) {
      return false;
    }
    return schema.every((row) => row.length === this.config.field.width);
  }
}
