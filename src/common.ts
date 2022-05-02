export interface SelectOption {
  value: string;
  label: string;
}

export type SchemaSymbol = string | number;
export type MutableSchema = Array<Array<SchemaSymbol>>;
export type Schema = MutableSchema | ReadonlyArray<ReadonlyArray<SchemaSymbol>>;
