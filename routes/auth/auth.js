import 'dotenv/config';
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from 'bcrypt';
import { verifyAccessToken, generateAccessToken, generateRefreshToken, validRegisterData, userAlreadyExists, validLoginData } from '../../middleware/auth.js';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const router = express.Router();

export const users = [];

export let refreshTokens = [];

router.get('/loggedIn', verifyAccessToken, (req, res) => {
    res.sendStatus(200);
});

router.post('/register', validRegisterData, userAlreadyExists, async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
        data: {
            name: username,
            email: email,
            password: hashedPassword
        }
    });

    res.sendStatus(201);
});

router.post('/login', validLoginData, async (req, res) => {
    const userId = req.userId;

    const accessToken = generateAccessToken({ id: userId });
    const refreshToken = generateRefreshToken({ id: userId });

    await prisma.tokens.create({
        data: {
            id_user: userId,
            token: refreshToken
        }
    });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false }).json({ accessToken: accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
});

router.post('/token', async (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return res.sendStatus(401);

    const data = await prisma.tokens.findFirst({
        select: {
            id_user: true
        },
        where: {
            token: refreshToken
        }
    });

    if (!data) return res.status(403).json({ 'message': 'invalid refresh token.' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({ id: data.id_user });
        res.json({ accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    });
});

router.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token;

    const data = await prisma.tokens.findFirst({
        select: {
            id_token: true
        },
        where: {
            token: refreshToken
        }
    });

    if (data.length <= 0)
        return res.status(400).json({ 'message': 'invalid token.' });

    await prisma.tokens.delete({
        where: {
            id_token: data.id_token,
            token: refreshToken
        }
    });

    res.sendStatus(204);
});

export default router;