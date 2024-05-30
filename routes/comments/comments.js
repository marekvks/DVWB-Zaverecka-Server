import express from "express";
import { validateAccessToken, validateUserPassword, updatePassword } from "../../middleware/auth.js";
const router = express.Router();

// endpoints
import add from "./endpoints/add.js";

router.post('/comment/add', validateAccessToken, add)

router.patch('/@me/password', validateAccessToken, validateUserPassword, updatePassword, (req, res) => res.sendStatus(204));

export default router;