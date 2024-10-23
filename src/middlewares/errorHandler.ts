import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { MongooseError } from "mongoose";

import { NODE_ENV } from "../config/env.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";

const handleError = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  const useGenericErrorMessages: boolean = NODE_ENV.trim() === "production";

  if (err instanceof jwt.JsonWebTokenError) {
    if (useGenericErrorMessages) {
      if (err.name === "ValidationError") {
        res.status(401).json({ error: "Error de validacion" });
      }

      if (err.name === "TokenExpiredError") {
        res.status(401).json({ error: "Token expirado" });
      }

      // res.status(401).json({ error: CLIENT_ERROR_MESSAGES.authError });
    } else {
      res.status(401).json({ error: err.message });
    }
  }

  if (err instanceof MongooseError) {
    if (useGenericErrorMessages) {
      if (err.name === "DocumentNotFoundError") {
        res.status(401).json({ error: "Recurso no encontrado" });
      }
      // res.status(400).json({ error: "Error de la base de datos" });
    } else {
      res.status(401).json({ error: err.message });
    }
  }

  if (err.message === CLIENT_ERROR_MESSAGES.accountAlreadyExists) {
    res.status(400).json({ error: CLIENT_ERROR_MESSAGES.accountAlreadyExists });
  }

  if (err.message === CLIENT_ERROR_MESSAGES.accountNotFound) {
    res.status(404).json({ error: CLIENT_ERROR_MESSAGES.accountNotFound });
  }

  if (err.message === CLIENT_ERROR_MESSAGES.incorrectPassword) {
    res.status(400).json({ error: CLIENT_ERROR_MESSAGES.incorrectPassword });
  }

  if (err.message === CLIENT_ERROR_MESSAGES.passwordIsMatch) {
    res.status(400).json({ error: CLIENT_ERROR_MESSAGES.passwordIsMatch });
  }

  if (err instanceof ZodError) {
    next();
  }

  // res.status(500).json({ error: CLIENT_ERROR_MESSAGES.unknownError })
};

export default handleError;
