import { NODE_ENV, IS_GITHUB_REPO, CLIENT_URL, GITHUB_REPO_NAME } from "../config/env";
import User from "../user-model";
import { ERROR_MESSAGES, ERROR_NAMES } from "../constants";
import { UserTypes } from "../interfaces/user";
import { CookieOptionsTypes } from "../interfaces";

const DEV_ENV = NODE_ENV.trim() === "development";

const setCookieOptions = (maxAge: number): CookieOptionsTypes => {
  return {
    httpOnly: !DEV_ENV,
    secure: !DEV_ENV,
    sameSite: !DEV_ENV,
    maxAge: maxAge,
  };
};

//
class AppError extends Error {
  public name: string;
  public origin: string;

  constructor(name: string, description: string, origin: string) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.origin = origin;

    Error.captureStackTrace(this);
  }
}

const handleCritialError = (err: unknown): void => {
  console.error("Error critico:", err);
  console.log("Programa finalizado debido a un error critico.");
  process.exit(1);
};

const validateUser = async (email: string | null, id: string | null, throwErrorIf: string): Promise<UserTypes> => {
  let user: any;

  if (email) {
    user = await User.findOne({ email });
  } else {
    user = await User.findById(id);
  }

  // Proporciona un throwErrorIf valido
  // Asegurar que cuando se llama esta funcion throwErrorIf sea siempre ERROR_MESSAGES.accountNotFound o ERROR_MESSAGES.accountAlreadyExists
  if (!user && throwErrorIf === ERROR_MESSAGES.accountNotFound) {
    throw new AppError(ERROR_NAMES.notFound, ERROR_MESSAGES.accountNotFound, "");
  } else if (!user && throwErrorIf === ERROR_MESSAGES.accountAlreadyExists) {
    throw new AppError(ERROR_NAMES.badRequest, ERROR_MESSAGES.accountAlreadyExists, "");
  }

  return user;
};

const buildClientUrl = (): string => {
  if (IS_GITHUB_REPO) {
    return `${CLIENT_URL}/${GITHUB_REPO_NAME}`;
  } else {
    return CLIENT_URL;
  }
};

const isDevelopmentEnv = (): boolean => {
  if (NODE_ENV.trim() === "development") {
    return true;
  } else {
    return false;
  }
};

export { setCookieOptions, AppError, handleCritialError, buildClientUrl, validateUser, isDevelopmentEnv };
