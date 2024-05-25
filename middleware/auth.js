import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'email-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : undefined; // 'Bearer SI6L5H452JD5GFIYgfihgGHDjkh4'
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(401);

        try {
            const userData = await prisma.user.findUnique({
                select: {
                    passwordVersion: true
                },
                where: {
                    id_user: user.id
                }
            });

            if (!userData) return res.sendStatus(401);

            if (user.pwdVersion === userData.passwordVersion) {
                req.user = user;
                return next();
            }

            return res.sendStatus(401);
        }
        catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }

    });
}

export const validateRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return res.status(404).json({ 'message': 'refresh token not found.' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(401);

        try {
            const userData = await prisma.user.findUnique({
                select: {
                    passwordVersion: true
                },
                where: {
                    id_user: user.id
                }
            });

            if (!userData) return res.sendStatus(401);

            if (user.pwdVersion === userData.passwordVersion) {
                req.user = user;
                return next();
            }

            return res.sendStatus(401);
        }
        catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    });
}

export const validatePassword = (req, res, next) => {
    const password = req.body.password;

    if (!password)
        return res.status(400).json({ message: 'invalid password.' });

    if (password.length < 8)
        return res.status(400).json({ message: 'password must be at least 8 characters long.' });

    next();
}

export const validRegisterData = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;

    if (!validator.validate(email))
        return res.status(400).json({ message: 'invalid email.' });

    if (!username || !email)
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
            password: true,
            passwordVersion: true
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
    req.passwordVersion = data.passwordVersion;
    next();
}

export const validateForgotPasswordCode = async (req, res, next) => {
    const email = req.body.email;
    const refreshCode = req.body.refreshCode;

    if (!validator.validate(email))
        return res.status(400).json({ message: 'invalid email.' });

    const user = await prisma.user.findFirst({
        select: {
            id_user: true,
            passwordVersion: true
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
                expires_at: true,
                used: true
            },
            where: {
                id_user: user.id_user,
            }
        });
    
        if (!tokenData)
            return res.status(404).json({ 'message': 'no reset password codes were generated.' });
        
        if (tokenData.expires_at < Date.now() || tokenData.used)
            return res.status(401).json({ 'message': 'code expired.' });

        const matchingToken = await bcrypt.compare(refreshCode, tokenData.token);
        if (matchingToken) {
            req.id_user = user.id_user;
            req.refreshCode = refreshCode;
            req.passwordVersion = user.passwordVersion;
            return next();
        }

        return res.status(401).json({'message': 'invalid code.'});
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}