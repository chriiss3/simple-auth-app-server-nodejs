import { Router } from "express";

import { updatePassword, getUser, deleteAccount, empty, updateEmail } from "../controllers/userController.js";
import verifyAccessToken from "../middlewares/accessTokenVerify.js";

const router = Router();

router.post("/updatePassword", verifyAccessToken, updatePassword);
router.get("/getUser", verifyAccessToken, getUser);
router.post("/deleteAccount", verifyAccessToken, deleteAccount);
router.get("/empty", verifyAccessToken, empty);
router.post("updateEmail", verifyAccessToken, updateEmail);

export default router;
