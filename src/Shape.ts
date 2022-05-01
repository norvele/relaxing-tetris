import { ShapeError, ShapeErrorCode } from "@/errors/ShapeError";

export type ShapeSchema<T = 1> = Array<Array<0 | T>>;

export interface ShapeI<T> {
  getSymbol(): T;
  getSchema(): ShapeSchema<T>;
  getSize(): number;
  rotateClockwise(): void;
  rotateCounterClockwise(): void;
  getRotateIndex(): number;
}

export class Shape<T> implements ShapeI<T> {
  protected currentSchema: ShapeSchema<T>;
  protected schemaSymbol: T;
  protected rotateIndex = 0;
  protected size = 0;

  constructor(principalSchema: ShapeSchema, schemaSymbol: T) {
    if (!this.guardSchemaSize(principalSchema)) {
      throw new ShapeError(
        "Wrong shape schema size",
        ShapeErrorCode.wrongSchemaSize
      );
    }
    this.currentSchema = this.getInitialSchema(principalSchema, schemaSymbol);
    this.size = this.currentSchema.length;
    this.schemaSymbol = schemaSymbol;
  }

  public getSymbol(): T {
    return this.schemaSymbol;
  }

  public getSchema(): ShapeSchema<T> {
    return this.currentSchema;
  }

  public getSize(): number {
    return this.size;
  }

  public rotateClockwise() {
    this.rotateIndex = this.rotateIndex === 3 ? 0 : this.rotateIndex + 1;
    this.currentSchema = this.currentSchema[0].map((val, index) =>
      this.currentSchema.map((row) => row[index]).reverse()
    );
  }

  public rotateCounterClockwise() {
    this.rotateIndex = this.rotateIndex === 0 ? 3 : this.rotateIndex - 1;
    this.currentSchema = this.currentSchema[0].map((val, index) =>
      this.currentSchema.map((row) => row[row.length - 1 - index])
    );
  }

  public getRotateIndex() {
    return this.rotateIndex;
  }

  protected getInitialSchema(
    principalSchema: ShapeSchema,
    schemaSymbol: T
  ): ShapeSchema<T> {
    return principalSchema.map((row) => {
      return row.map((item) => (item === 1 ? schemaSymbol : 0));
    });
  }

  protected guardSchemaSize(schema: ShapeSchema) {
    const size = schema.length;
    return schema.every((row) => row.length === size);
  }
}
