import { BaseError } from "@/errors/BaseError";

export enum GameErrorCode {
  shapeMustBeOne,
  noShape,
  wrongSchemaSize
}

export class GameError extends BaseError<GameErrorCode> {
  public name = "GameError";
}
