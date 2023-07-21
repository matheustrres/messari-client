export class InternalError extends Error {
  public code: number;
  public message: string;
  public timestamp: string;

  constructor(message: string, code: number = 500, timestamp: string) {
    super(message);

    this.message = message;
    this.code = code;
    this.timestamp = timestamp;

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}