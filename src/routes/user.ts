import { Router } from "express";

import { updatePassword, getUser, deleteAccount, empty, updateEmail, getUsers } from "../controllers/user.js";
import verifyClientToken from "../middlewares/client-token-verify.js";

const router = Router();

router.post("/v1/user/updatePassword", verifyClientToken, updatePassword);
router.get("/v1/user/getUser", verifyClientToken, getUser);
router.post("/v1/user/deleteAccount", verifyClientToken, deleteAccount);
router.get("/v1/user/empty", verifyClientToken, empty);
router.post("/v1/user/updateEmail", verifyClientToken, updateEmail);
router.get("/v1/user/getUsers", getUsers);

export default router;
