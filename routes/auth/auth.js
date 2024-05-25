import 'dotenv/config';
import express from "express";
import { verifyAccessToken, validRegisterData, userAlreadyExists, validLoginData, validateForgotPasswordCode, validateRefreshToken, validatePassword } from '../../middleware/auth.js';
// endpoints
import { authorized } from './endpoints/authorized.js';
import { register } from './endpoints/register.js';
import { login } from './endpoints/login.js';
import { getNewAccessToken } from './endpoints/getNewAccessToken.js';
import { checkRefreshToken } from './endpoints/checkRefreshToken.js';
import { logout } from './endpoints/logout.js';
import { requestRefreshPassword } from './endpoints/requestRefreshPassword.js';
import updatePassword from './endpoints/updatePassword.js';

const router = express.Router();

// check if user is authorized
router.get('/authorized', verifyAccessToken, authorized);

// register user
router.post('/register', validatePassword, validRegisterData, userAlreadyExists, register);

// login user
router.post('/login', validLoginData, login);

// get new access token
router.get('/accessToken', validateRefreshToken, getNewAccessToken);

// check refresh token, if it expires in less than 7 days, send new refresh token
router.get('/refreshToken', validateRefreshToken, checkRefreshToken);

// logout user
router.delete('/logout', logout);

router.post('/refreshPasswordCode', requestRefreshPassword);
router.post('/checkForgotPasswordCode', validateForgotPasswordCode, (req, res) => res.sendStatus(200));

router.patch('/updatePassword', validateForgotPasswordCode, validatePassword, updatePassword);

export default router;