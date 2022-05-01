import { BaseError } from "@/errors/BaseError";

export enum ShapeErrorCode {
  wrongSchemaSize,
}

export class ShapeError extends BaseError<ShapeErrorCode> {
  public name = "FigureError";
}
