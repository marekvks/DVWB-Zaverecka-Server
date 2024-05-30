import express from "express";
import { validateAccessToken, validateUserPassword, updatePassword } from "../../middleware/auth.js";
const router = express.Router();

// endpoints
import add from "./endpoints/add.js";

router.post('/add', validateAccessToken, add)

export default router;