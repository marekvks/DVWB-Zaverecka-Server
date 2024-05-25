import 'dotenv/config';
import express from "express";

//middleware
import { validateAccessToken, userAlreadyExists, validateLoginData, validateForgotPasswordCode, validateRefreshToken, validatePassword, validateEmail, validateUsername } from '../../middleware/auth.js';

// endpoints
import register from './endpoints/register.js';
import login from './endpoints/login.js';
import getNewAccessToken from './endpoints/getNewAccessToken.js';
import checkRefreshToken from './endpoints/checkRefreshToken.js';
import logout from './endpoints/logout.js';
import requestRefreshPassword from './endpoints/requestRefreshPassword.js';
import updatePassword from './endpoints/updatePassword.js';

const router = express.Router();

// check if user is authorized
router.get('/authorized', validateAccessToken, (req, res) => res.sendStatus(200));

// register user
router.post('/register', validateEmail, validateUsername, validatePassword, userAlreadyExists, register);

// login user
router.post('/login', validateLoginData, login);

// logout user
router.delete('/logout', logout);

// get new access token
router.get('/accessToken', validateRefreshToken, getNewAccessToken);

// check refresh token, if it expires in less than 7 days, send new refresh token
router.get('/refreshToken', validateRefreshToken, checkRefreshToken);

// send refresh password code
router.post('/refreshPasswordCode', requestRefreshPassword);

// check forgotten password code
router.post('/checkForgotPasswordCode', validateEmail, validateForgotPasswordCode, (req, res) => res.sendStatus(200));

// update forgotten password
router.patch('/updatePassword', validateEmail, validateForgotPasswordCode, validatePassword, updatePassword);

export default router;