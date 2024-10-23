import { Router } from "express";
import { updatePassword, getUserData } from "../controllers/userController.js";
import verifyAccessToken from "../middlewares/accessTokenVerify.js";
const router = Router();
router.post("/update-password", verifyAccessToken, updatePassword);
router.get("/user-data", verifyAccessToken, getUserData);
// router.post("/delete-account", verifyAccessToken, deleteAccount);
export default router;
