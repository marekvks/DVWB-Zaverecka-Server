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
import { requestRefreshPassword } from './endpoints/requestRefreshPassword.js';
import { refreshPassword } from './endpoints/refreshPassword.js';

const router = express.Router();

// check if user is authorized
router.get('/authorized', verifyAccessToken, authorized);

// register user
router.post('/register', validRegisterData, userAlreadyExists, register);

// login user
router.post('/login', validLoginData, login);

// get new access token
router.get('/accessToken', getNewAccessToken);

// check refresh token, if it expires in less than 7 days, send new refresh token
router.get('/refreshToken', checkRefreshToken);

// logout user
router.delete('/logout', logout);

router.get('/refreshPasswordCode', requestRefreshPassword);
router.get('/refreshPassword', refreshPassword);

export default router;