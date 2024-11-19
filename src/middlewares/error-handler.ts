import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { CLIENT_ERROR_MESSAGES, ERROR_MESSAGES, JWT_ERROR_MESSAGES, MONGOOSE_ERROR_MESSAGES } from "../constants.js";
import { AppError } from "../utils/index.js";
import { NODE_ENV } from "../config/env.js";

const handleError = async (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const DEV_ENV = NODE_ENV.trim() === "development";
  if (DEV_ENV) console.error(err);

  // Libraries error
  if (err.message === "jwt expired") {
    if (err.origin === "resetPassword") {
      return res.status(401).json({ error: CLIENT_ERROR_MESSAGES.expiredResetLink });
    } else if (err.origin === "getNewToken") {
      return res.status(401).json({ error: CLIENT_ERROR_MESSAGES.sessionExpired });
    } else {
      return res.sendStatus(401);
    }
  }

  if (MONGOOSE_ERROR_MESSAGES.includes(err.message)) {
    return res.sendStatus(404);
  }

  if (JWT_ERROR_MESSAGES.includes(err.message)) {
    return res.sendStatus(401);
  }

  // Custom error
  // Unauthorized
  if (err.message === ERROR_MESSAGES.invalidToken) {
    return res.status(401).json({ error: CLIENT_ERROR_MESSAGES.authError });
  }

  // Not Found
  if (err.message === ERROR_MESSAGES.accountNotFound) {
    return res.status(404).json({ error: CLIENT_ERROR_MESSAGES.accountNotFound });
  }

  if (err.message === ERROR_MESSAGES.refreshTokenNotFound) {
    return res.status(404).json({ error: CLIENT_ERROR_MESSAGES.authError });
  }

  if (err.message === ERROR_MESSAGES.userNotFound) {
    return res.status(404).json({ error: CLIENT_ERROR_MESSAGES.userNotFound });
  }

  // Bad Request
  if (err.message === ERROR_MESSAGES.accountAlreadyExists) {
    return res.status(400).json({ error: CLIENT_ERROR_MESSAGES.accountAlreadyExists });
  }

  if (err.message === ERROR_MESSAGES.incorrectPassword) {
    return res.status(400).json({ error: CLIENT_ERROR_MESSAGES.incorrectPassword });
  }

  if (err.message === ERROR_MESSAGES.passwordIsMatch) {
    return res.status(400).json({ error: CLIENT_ERROR_MESSAGES.passwordIsMatch });
  }

  // Ignore
  if (err instanceof ZodError) {
    return next();
  }
};

export default handleError;
