import express from "express";
import { validateAccessToken, validateUserPassword, updatePassword } from "../../middleware/auth.js";
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

router.patch('/@me', validateAccessToken, patchMe);

router.patch('/@me/password', validateAccessToken, validateUserPassword, updatePassword, (req, res) => res.sendStatus(204));

router.patch('/@me/avatar', validateAccessToken, upload, changeAvatar);

router.get('/id/:id', getUser);

router.get('/:username', getUserViaUsername);

export default router;