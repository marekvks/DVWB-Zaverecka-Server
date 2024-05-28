import express from "express";
import { validateAccessToken } from "../../middleware/auth.js";
import { upload } from "../../middleware/uploadFile.js";
const router = express.Router();

// endpoints
import getMe from "./endpoints/getMe.js";
import getUser from "./endpoints/getUser.js";
import patchMe from "./endpoints/patchMe.js";
import changePassword from "./endpoints/changePassword.js";
import changeAvatar from "./endpoints/changeAvatar.js";
import getUserViaUsername from './endpoints/getUserViaUsername.js';

router.get('/@me', validateAccessToken, getMe);

router.get('/id/:id', getUser);

router.get('/:username', getUserViaUsername);

router.patch('/@me', validateAccessToken, patchMe);

router.patch('@me/password', validateAccessToken, changePassword)

router.patch('/@me/avatar', validateAccessToken, upload, changeAvatar);

export default router;