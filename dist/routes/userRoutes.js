import { Router } from "express";
import { updatePassword, getUserData } from "../controllers/userController";
import verifyAccessToken from "../middlewares/accessTokenVerify";
const router = Router();
router.post("/update-password", verifyAccessToken, updatePassword);
router.get("/user-data", verifyAccessToken, getUserData);
// router.post("/delete-account", verifyAccessToken, deleteAccount);
export default router;
//   "include": ["src/**/*.ts", "express.d.ts"]git config --global user.email "tu.nueva.email@example.com"
