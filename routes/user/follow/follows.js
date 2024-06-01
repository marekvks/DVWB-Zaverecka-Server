import express from "express";
import { validateAccessToken } from "../../../middleware/auth.js";
const router = express.Router();

//middleware
import { alreadyFollowing } from "../../../middleware/follow.js";

// endpoints
import getFollowing from "./endpoints/getFollowing.js";
import getFollowers from "./endpoints/getFollowers.js";
import followUser from "./endpoints/followUser.js";
import unfollowUser from "./endpoints/unfollowUser.js";

router.get('/:userId/following', getFollowing);

router.get('/:userId/followers', getFollowers);

router.post('/', validateAccessToken, alreadyFollowing, followUser);

router.delete('/:followId', validateAccessToken, unfollowUser);

export default router;