import express from "express";
import { validateAccessToken } from "../../../middleware/auth.js";
import { upload } from "../../middleware/uploadFile.js";
const router = express.Router();

// endpoints
import getFollowedUsers from "./endpoints/getFollowedUsers.js";
import followUser from "./endpoints/followUser.js";
import unfollowUser from "./endpoints/unfollowUser.js";

router.get('/:userId', getFollowedUsers);

router.post('/', validateAccessToken, followUser);

router.delete('/:followId', validateAccessToken, unfollowUser);

export default router;