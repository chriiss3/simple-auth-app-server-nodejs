export class AppError extends Error {
  public readonly name: string;
  public readonly origin: string;

  constructor(name: string, description: string, origin: string) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.origin = origin;

    Error.captureStackTrace(this);
  }
}

export default AppError;
