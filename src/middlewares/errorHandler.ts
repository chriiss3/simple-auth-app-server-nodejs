import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { CLIENT_ERROR_MESSAGES, JWT_ERROR_MESSAGES, MONGOOSE_ERROR_MESSAGES } from "../constants.js";
import AppError from "../utils/customError.js";
import { NODE_ENV } from "../config/env.js";

const handleError = async (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const DEV_ENV = NODE_ENV.trim() === "development";

  if (DEV_ENV) console.error(err);

  if (err.message === "jwt expired") {
    if (err.origin === "resetPassword") {
      return res.status(401).json({ error: "Enlace de restablecimiento de contraseña expirado." });
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

  if (err.message === CLIENT_ERROR_MESSAGES.accountNotFound) {
    return res.status(404).json({ error: CLIENT_ERROR_MESSAGES.accountNotFound });
  }

  if (err.message === CLIENT_ERROR_MESSAGES.accountAlreadyExists) {
    return res.status(400).json({ error: CLIENT_ERROR_MESSAGES.accountAlreadyExists });
  }

  if (err.message === CLIENT_ERROR_MESSAGES.incorrectPassword) {
    return res.status(400).json({ error: CLIENT_ERROR_MESSAGES.incorrectPassword });
  }

  if (err.message === CLIENT_ERROR_MESSAGES.passwordIsMatch) {
    return res.status(400).json({ error: CLIENT_ERROR_MESSAGES.passwordIsMatch });
  }

  if (err instanceof ZodError) {
    return next();
  }
};

export default handleError;
