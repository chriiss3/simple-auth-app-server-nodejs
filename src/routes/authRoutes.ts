import { Router } from "express";
import { login, register, logout, forgotPassword, resetPassword,getNewToken } from "../controllers/authController.js";
import validateData from "../middlewares/dataValidator.js";
import { registerSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema } from "../authSchemas.js";

const router = Router();

router.post("/login", validateData(loginSchema), login);
router.post("/register", validateData(registerSchema), register);
router.post("/logout", logout);
router.post("/forgotPassword", validateData(forgotPasswordSchema), forgotPassword);
router.post("/resetPassword", validateData(resetPasswordSchema), resetPassword);
router.post("/getNewToken", getNewToken);

export default router;
