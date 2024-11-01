import jwt from "jsonwebtoken";
import { generateAccessToken, validateAccessToken, validateRefreshToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import User from "../userModel.js";
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  ACCESS_TOKEN_COOKIE_EXPIRE_TIME,
  NODE_ENV,
} from "../config/env.js";
import { setAuthCookie } from "../utils/cookie.js";
import { UserTokenPayloadTypes } from "../interfaces/userInterfaces.js";

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.auth_access_token;
  const DEV_ENV = NODE_ENV.trim() === "development";

  try {
    const decoded = await validateAccessToken(accessToken, JWT_ACCESS_SECRET_KEY);
    const userFound = await User.findOne({ _id: decoded.id });

    if (!userFound) return res.sendStatus(404);

    req.user = {
      email: userFound.email,
      password: userFound.password,
      name: userFound.name,
      refreshToken: userFound.refreshToken,
      sessionActive: userFound.sessionActive,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      id: userFound._id,
    };

    next();
  } catch (err) {
    if (DEV_ENV) console.error(err);

    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError || err instanceof jwt.NotBeforeError) {
      if (err.name === "TokenExpiredError") {
        const decoded = jwt.decode(accessToken) as UserTokenPayloadTypes;
        if (!decoded) res.sendStatus(401);

        const userFound = await User.findOne({ _id: decoded.id });
        if (!userFound) return res.sendStatus(404);

        if (!userFound.refreshToken) return res.sendStatus(401);

        try {
          const refreshTokenDecoded = await validateRefreshToken(userFound.refreshToken, JWT_REFRESH_SECRET_KEY);

          const newAccessToken = await generateAccessToken({ id: refreshTokenDecoded.id }, JWT_ACCESS_SECRET_KEY);

          req.user = {
            email: userFound.email,
            password: userFound.password,
            name: userFound.name,
            refreshToken: userFound.refreshToken,
            sessionActive: userFound.sessionActive,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            id: userFound._id,
          };

          res.clearCookie(JWT_ACCESS_TOKEN_NAME);
          setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, newAccessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);

          next();
        } catch (err) {
          // Si hay un error con el token de actualizacion
          if (DEV_ENV) console.error(err);

          await User.findByIdAndUpdate(userFound.id, { refreshToken: null }, { new: true });

          return res.status(401).json({ error: "Error de autenticación, vuelve a iniciar sesion." });
        }
      } else if (err.message === "jwt must be provided") {
        return res.sendStatus(401)
      } else {
        // Si es un error distinto a "TokenExpiredError"

        res.clearCookie(JWT_ACCESS_TOKEN_NAME);
        return res.status(401).json({ error: "Error de autenticación, vuelve a iniciar sesion." });
      }
    }
  }
};

export default verifyAccessToken;
