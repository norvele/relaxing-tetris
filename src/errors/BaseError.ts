type ErrorData = Record<string, any>;
type Code = string | number;

export class BaseError<C extends Code, D = ErrorData> extends Error {
  public name = "BaseError";
  public code: C;
  public data: ErrorData = {};

  constructor(message: string, code: C, data?: D, stack?: string) {
    super(message);
    this.code = code;
    this.stack = stack || "";
    this.data = data || {};
  }
}
