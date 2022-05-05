export interface SelectOption {
  value: string;
  label: string;
}

export type SchemaSymbol = string | number;
export type MutableSchema = Array<Array<SchemaSymbol>>;
export type Schema = MutableSchema | ReadonlyArray<ReadonlyArray<SchemaSymbol>>;

export enum GameState {
  notStarted,
  played,
  paused,
  ended,
}

export enum Theme {
  lcd = "lcd",
  crt = "crt",
  color = "color",
}
