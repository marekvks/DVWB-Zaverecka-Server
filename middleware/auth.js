import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'email-validator';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : undefined; // 'Bearer SI6L5H452JD5GFIYgfihgGHDjkh4'
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        console.log(user);
        next();
    });
}

export const validRegisterData = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!validator.validate(email))
        return res.status(400).json({ message: 'invalid email.' });

    if (!username || !email || !password)
        return res.status(400).json({ message: 'invalid data.' });

    next();
}

export const userAlreadyExists = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;

    const data = await prisma.user.findMany({
        select: {
            username: true,
            email: true
        },
        where: {
            OR: [
                { username: username },
                { email: email }
            ]
        }
    });

    if (!data || data.length <= 0)
        return next();

    return res.status(400).json({ message: 'username or email is already used.' });
}

export const validLoginData = async (req, res, next) => {
    const email = req.body.email;

    const data = await prisma.user.findFirst({
        select: {
            id_user: true,
            email: true,
            password: true
        },
        where: {
            email: email
        }
    });

    if (!data || data.length <= 0)
        return res.status(400).json({ message: 'invalid email or password.' });

    const password = req.body.password;

    const matchingPwd = await bcrypt.compare(password, data.password);
    if (!matchingPwd)
        return res.status(400).json({ message: 'invalid email or password.' });

    req.userId = data.id_user;
    next();
}

export const validateForgotPasswordCode = async (req, res, next) => {
    const email = req.body.email;
    const refreshCode = req.body.refreshCode;

    // TODO: validate email

    const user = await prisma.user.findFirst({
        select: {
            id_user: true
        },
        where: {
            email: email
        }
    });

    if (!user)
        return res.status(400).json({ message: 'user not found.' });

    try {
        const tokenData = await prisma.refresh_password_tokens.findUnique({
            select: {
                token: true,
                expires_at: true
            },
            where: {
                id_user: user.id_user,
            }
        });
    
        if (!tokenData)
            return res.status(404).json({ 'message': 'no reset password codes were generated.' });
        
        if (tokenData.expires_at < Date.now())
            return res.status(401).json({ 'message': 'code expired.' });

        const matchingToken = await bcrypt.compare(refreshCode, tokenData.token);
        if (matchingToken) {
            req.id_user = user.id_user;
            req.refreshCode = refreshCode;
            return next();
        }

        return res.status(401).json({'message': 'invalid code.'});
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}