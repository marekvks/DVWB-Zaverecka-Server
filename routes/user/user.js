import express from "express";
import { verifyAccessToken } from "../../middleware/auth.js";
import { upload } from "../../middleware/uploadFile.js";
const router = express.Router();

// endpoints
import getMe from "./endpoints/getMe.js";
import getUser from "./endpoints/getUser.js";
import patchMe from "./endpoints/patchMe.js";
import changePassword from "./endpoints/changePassword.js";
import changeAvatar from "./endpoints/changeAvatar.js";

router.get('/@me', verifyAccessToken, getMe);

router.get('/:id', getUser);

router.patch('/@me', verifyAccessToken, patchMe);

router.patch('@me/password', verifyAccessToken, changePassword)

router.patch('/@me/avatar', verifyAccessToken, upload, changeAvatar);

export default router;