import { JWT_ACCESS_SECRET_KEY, JWT_ACCESS_TOKEN_NAME, JWT_REFRESH_SECRET_KEY, JWT_REFRESH_TOKEN_NAME, REFRESH_TOKEN_COOKIE_EXPIRE_TIME, ACCESS_TOKEN_COOKIE_EXPIRE_TIME, } from "../config/env.js";
import { CLIENT_SUCCES_MESSAGES } from "../constants.js";
import { validateUser, registerUser, sendResetLink, resetUserPassword } from "../services/authServices.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { removeAuthCookie, setAuthCookie } from "../utils/cookie.js";
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (req.cookies.auth_access_token)
            removeAuthCookie(res, JWT_ACCESS_TOKEN_NAME);
        if (req.cookies.auth_refresh_token)
            removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);
        const userSaved = await registerUser(email, password, name);
        const accessToken = await generateAccessToken({ id: userSaved._id }, JWT_ACCESS_SECRET_KEY);
        const refreshToken = await generateRefreshToken({ id: userSaved._id }, JWT_REFRESH_SECRET_KEY);
        setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);
        setAuthCookie(res, JWT_REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_COOKIE_EXPIRE_TIME);
        res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.registerSuccess });
    }
    catch (err) {
        next(err);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (req.cookies.auth_access_token)
            removeAuthCookie(res, JWT_ACCESS_TOKEN_NAME);
        if (req.cookies.auth_refresh_token)
            removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);
        const userFound = await validateUser(email, password);
        const accessToken = await generateAccessToken({ id: userFound._id }, JWT_ACCESS_SECRET_KEY);
        const refreshToken = await generateRefreshToken({ id: userFound._id }, JWT_REFRESH_SECRET_KEY);
        setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);
        setAuthCookie(res, JWT_REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_COOKIE_EXPIRE_TIME);
        res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.loginSuccess });
    }
    catch (err) {
        next(err);
    }
};
const logout = async (req, res, next) => {
    try {
        removeAuthCookie(res, JWT_ACCESS_TOKEN_NAME);
        removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);
        res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.logoutSuccess });
    }
    catch (err) {
        next(err);
    }
};
const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        sendResetLink(email);
        res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.linkSent });
    }
    catch (err) {
        next(err);
    }
};
const resetPassword = async (req, res, next) => {
    try {
        const newPassword = req.body.newPassword;
        const heeaderToken = req.headers.authorization?.split(" ")[1];
        const userReset = await resetUserPassword(heeaderToken, newPassword);
        const accessToken = await generateAccessToken({ id: userReset._id }, JWT_ACCESS_SECRET_KEY);
        const refreshToken = await generateRefreshToken({ id: userReset._id }, JWT_REFRESH_SECRET_KEY);
        setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);
        setAuthCookie(res, JWT_REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_COOKIE_EXPIRE_TIME);
        return res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.passwordResetSuccess });
    }
    catch (err) {
        next(err);
    }
};
export { register, login, logout, forgotPassword, resetPassword };
