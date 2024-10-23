import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { CLIENT_ERROR_MESSAGES } from "../constants";
import { MongooseError } from "mongoose";
import { NODE_ENV } from "../config/env";
const handleError = async (err, req, res, next) => {
    const useGenericErrorMessages = NODE_ENV.trim() === "production";
    if (err instanceof jwt.JsonWebTokenError) {
        if (useGenericErrorMessages) {
            if (err.name === "ValidationError") {
                res.status(401).json({ error: "Error de validacion" });
            }
            if (err.name === "TokenExpiredError") {
                res.status(401).json({ error: "Token expirado" });
            }
        }
        else {
            res.status(401).json({ error: err.message });
        }
        // res.status(401).json({ error: CLIENT_ERROR_MESSAGES.authError });
    }
    if (err instanceof MongooseError) {
        // res.status(400).json({ error: "Error de la base de datos" });
        if (useGenericErrorMessages) {
            if (err.name === "DocumentNotFoundError") {
                res.status(401).json({ error: "Recurso no encontrado" });
            }
        }
        else {
            res.status(401).json({ error: err.message });
        }
    }
    if (err.message === CLIENT_ERROR_MESSAGES.accountAlreadyExists) {
        // await handler.handleError(res, new AppError(err.message, true, 404));
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
// errorCustomizer.ts
