import express from "express";
import { validateAccessToken } from "../../middleware/auth.js";
import { upload } from "../../middleware/uploadFile.js";
const router = express.Router();

// endpoints
import getMe from "./endpoints/getMe.js";
import getUser from "./endpoints/getUser.js";
import patchMe from "./endpoints/patchMe.js";
import changeAvatar from "./endpoints/changeAvatar.js";
import getAvatar from "./endpoints/getAvatar.js";
import getUserAvatar from "./endpoints/getUserAvatar.js";
import getUserViaUsername from './endpoints/getUserViaUsername.js';

router.get('/@me', validateAccessToken, getMe);

router.get('/:id', getUser);

router.patch('/@me', validateAccessToken, patchMe);

router.patch('/@me/password', validateAccessToken, validateUserPassword, updatePassword, (req, res) => res.sendStatus(204));

router.get('/@me/avatar', validateAccessToken, getAvatar);

router.get('/id/:id/avatar', getUserAvatar);

router.patch('/@me/avatar', validateAccessToken, upload, changeAvatar);

export default router;