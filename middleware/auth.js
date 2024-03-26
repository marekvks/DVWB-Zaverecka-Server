import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { refreshTokens, users } from '../routes/auth/auth.js';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : undefined; // 'Bearer SI6L5H452JD5GFIYgfihgGHDjkh4'
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

export const validRegisterData = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // check if email rules correspond

    if (!username || !email || !password)
        return res.status(400).json({ message: 'invalid data.' });

    next();
}

export const userAlreadyExists = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;

    const data = await prisma.users.findMany({
        select: {
            name: true,
            email: true
        },
        where: {
            OR: [
                { name: username },
                { email: email }
            ]
        }
    });

    if (data.length >= 1)
        return res.status(400).json({ message: 'username or email is already used.' });

    next();
}

export const validLoginData = async (req, res, next) => {
    const email = req.body.email;

    const data = await prisma.users.findFirst({
        select: {
            id_user: true,
            email: true,
            password: true
        },
        where: {
            email: email
        }
    });

    if (data.length <= 0)
        return res.status(400).json({ message: 'invalid email or password.' });

    const password = req.body.password;

    const matchingPwd = await bcrypt.compare(password, data.password);
    if (!matchingPwd)
        return res.status(400).json({ message: 'invalid email or password.' });

    req.userId = data.id_user;
    next();
}

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
}

export const generateRefreshToken = (user) => {
    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(token);
    return token;
}