import { ErrorCode } from './errorCode';

abstract class BaseError extends Error {
  readonly code: ErrorCode;
  readonly httpStatusCode: number;
  readonly timestamp: string;

  constructor(message: string, code: ErrorCode, httpStatusCode: number) {
    super(message);
    this.code = code;
    this.httpStatusCode = httpStatusCode;
    this.timestamp = new Date().toISOString();

    /**
     * Maintain proper stack trace for where our error was thrown
     * (only available on V8)
     */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Make the name property of the error non-enumerable, which means that
     * it won't show up when iterated through the object using Object.keys()
     * or a for...in loop. You can still access the property directly
     * on the object though.
     */
    Object.defineProperty(this, 'name', { value: this.constructor.name });
  }
}

export { BaseError };
