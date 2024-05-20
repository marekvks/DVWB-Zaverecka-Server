import 'dotenv/config';
import express from "express";
import { verifyAccessToken, validRegisterData, userAlreadyExists, validLoginData } from '../../middleware/auth.js';
// endpoints
import { authorized } from './endpoints/authorized.js';
import { register } from './endpoints/register.js';
import { login } from './endpoints/login.js';
import { getNewAccessToken } from './endpoints/getNewAccessToken.js';
import { checkRefreshToken } from './endpoints/checkRefreshToken.js';
import { logout } from './endpoints/logout.js';

const router = express.Router();

router.get('/authorized', verifyAccessToken, authorized);

router.post('/register', validRegisterData, userAlreadyExists, register);

router.post('/login', validLoginData, login);

router.get('/accessToken', getNewAccessToken);

router.get('/refreshToken', checkRefreshToken);

router.delete('/logout', logout);

export default router;