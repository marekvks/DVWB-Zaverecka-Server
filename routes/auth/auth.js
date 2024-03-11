import 'dotenv/config';
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { verifyAccessToken, generateAccessToken, generateRefreshToken, validRegisterData, userAlreadyExists, validLoginData } from '../../middleware/auth.js';

const router = express.Router();

export const users = [];

export let refreshTokens = [];

router.get('/test', verifyAccessToken, (req, res) => {
    res.sendStatus(200);
});

router.post('/register', validRegisterData, userAlreadyExists, async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        username: username,
        email: email,
        password: hashedPassword
    }

    users.push(newUser);
    res.sendStatus(201);
    console.log(users);
});

router.post('/login', validLoginData, async (req, res) => {
    const user = req.user;

    console.log(user.id);

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({ id: user.id });
        res.json({ accessToken });
    });
});

router.delete('/logout', (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(204);
});

export default router;