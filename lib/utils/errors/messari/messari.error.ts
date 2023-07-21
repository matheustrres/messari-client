import { InternalError } from '../internal.error';

export class MessariError extends InternalError {
  constructor(message: string, code: number, timestamp: string) {
    super(
      message,
      code,
      timestamp
    );
  }
}