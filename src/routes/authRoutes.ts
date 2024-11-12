import { Router } from "express";
import { login, register, logout, forgotPassword, resetPassword,getNewAccessToken } from "../controllers/authController.js";
import validateData from "../middlewares/dataValidator.js";
import { registerSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema } from "../authSchemas.js";

const router = Router();

router.post("/login", validateData(loginSchema), login);
router.post("/register", validateData(registerSchema), register);
router.post("/logout", logout);
router.post("/forgot-password", validateData(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateData(resetPasswordSchema), resetPassword);
router.post("/getNewAccessToken", getNewAccessToken);

export default router;
