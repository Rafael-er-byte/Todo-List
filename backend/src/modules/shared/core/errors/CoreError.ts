export default class CoreError extends Error {
  public info?: unknown;

  constructor(message: string, info: unknown) {
    super(message);
    this.info = info;

    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}
