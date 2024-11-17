import { Router } from "express";
import { login, register, logout, forgotPassword, resetPassword, getNewToken } from "../controllers/authController.js";
import validateData from "../middlewares/dataValidator.js";
import { registerSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema } from "../authSchemas.js";

const router = Router();

router.post("/v1/auth/login", validateData(loginSchema), login);
router.post("/v1/auth/register", validateData(registerSchema), register);
router.post("/v1/auth/logout", logout);
router.post("/v1/auth/forgotPassword", validateData(forgotPasswordSchema), forgotPassword);
router.post("/v1/auth/resetPassword", validateData(resetPasswordSchema), resetPassword);
router.post("/v1/auth/getNewToken", getNewToken);

export default router;
