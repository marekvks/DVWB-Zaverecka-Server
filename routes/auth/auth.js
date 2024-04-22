import 'dotenv/config';
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from 'bcrypt';
import { verifyAccessToken, generateAccessToken, generateRefreshToken, encryptRefreshToken, validRegisterData, userAlreadyExists, validLoginData } from '../../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

router.get('/loggedIn', verifyAccessToken, (req, res) => {
    res.sendStatus(200);
});

router.post('/register', validRegisterData, userAlreadyExists, async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            username: username,
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

    const encryptedRefreshToken = encryptRefreshToken(refreshToken);

    await prisma.tokens.create({
        data: {
            id_user: userId,
            token: encryptedRefreshToken
        }
    });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, path: '/' })
       .cookie('accessToken', accessToken, { httpOnly: false, secure: false, path: '/' })
       .json({ accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
});

router.get('/token', async (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return res.sendStatus(403).json({ 'message': 'invalid refresh token.' });

    const encryptedToken = encryptRefreshToken(refreshToken);

    const data = await prisma.tokens.findFirst({
        select: {
            id_user: true
        },
        where: {
            token: encryptedToken
        }
    });

    if (!data) return res.status(403).json({ 'message': 'invalid refresh token.' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(500);

        const accessToken = generateAccessToken({ id: data.id_user });
        res.cookie('accessToken', accessToken, { httpOnly: false, secure: false, path: '/' })
           .status(200)
           .json({ 'accessToken': accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        });
});

router.delete('/logout', async (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken)
        return res.status(401).json({ 'message': 'invalid token.' });

    const encryptedToken = encryptRefreshToken(refreshToken);

    const data = await prisma.tokens.findFirst({
        select: {
            id_token: true
        },
        where: {
            token: encryptedToken
        }
    });

    if (!data)
        return res.status(404).json({ 'message': 'token not found.' });

    await prisma.tokens.delete({
        where: {
            id_token: data.id_token,
            token: encryptedToken
        }
    });

    res.sendStatus(204);
});

export default router;