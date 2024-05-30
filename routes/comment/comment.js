import express from "express";
import { validateAccessToken, validateUserPassword, updatePassword } from "../../middleware/auth.js";
const router = express.Router();

// endpoints
import add from "./endpoints/add.js";
import allFromPost from "./endpoints/allFromPost.js";

router.post('/add', validateAccessToken, add);

router.get('/fromPost/:id', allFromPost);

export default router;