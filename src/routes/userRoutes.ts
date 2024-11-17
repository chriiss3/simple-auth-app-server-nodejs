import { Router } from "express";

import { updatePassword, getUser, deleteAccount, empty, updateEmail, getUsers } from "../controllers/userController.js";
import verifyAccessToken from "../middlewares/accessTokenVerify.js";

const router = Router();

router.post("/v1/user/updatePassword", verifyAccessToken, updatePassword);
router.get("/v1/user/getUser", verifyAccessToken, getUser);
router.post("/v1/user/deleteAccount", verifyAccessToken, deleteAccount);
router.get("/v1/user/empty", verifyAccessToken, empty);
router.post("/v1/user/updateEmail", verifyAccessToken, updateEmail);
router.get("/v1/user/getUsers", getUsers);

export default router;

