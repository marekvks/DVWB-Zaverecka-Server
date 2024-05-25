import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'email-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * **Middleware**
 * 
 * Validates access token, if it's valid, you can access the user data via req.user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validateAccessToken = (req, res, next) => {
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

/**
 * **Middleware**
 * 
 * Validates refresh token, if it's valid, you can access the user data via req.user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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

/**
 * **Middleware**
 * 
 * Validates password, if it's valid, you can access the password via req.password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validatePassword = (req, res, next) => {
    const password = req.body.password;

    if (!password)
        return res.status(400).json({ message: 'invalid password.' });

    if (password.length < 8)
        return res.status(400).json({ message: 'password must be at least 8 characters long.' });

    req.password = password;

    next();
}

/**
 * **Middleware**
 * 
 * Validates email via `email-validator` package, if it's valid, you can access the email via req.email
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validateEmail = (req, res, next) => {
    const email = req.body.email;

    if (!validator.validate(email))
        return res.status(400).json({ message: 'invalid email.' });

    req.email = email;

    next();
}

/**
 * **Middleware**
 * 
 * Validates username, if it's valid, you can access the username via req.username
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validateUsername = (req, res, next) => {
    const username = req.body.username;

    if (!username)
        return res.status(400).json({ message: 'invalid username.' });

    if (username.length < 4)
        return res.status(400).json({ message: 'username must be at least 4 characters long.' });

    req.username = username;

    next();
}

/**
 * **Middleware**
 * 
 * Checks if user with the same username or email already exists and if so, returns 400
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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

/**
 * **Middleware**
 * 
 * Checks if the data sent in the request body is valid for login
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validateLoginData = async (req, res, next) => {
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

/**
 * **Middleware**
 * 
 * Validates code for password reset, if it's valid, you can access the user id via req.id_user, the refresh code via req.refreshCode and the password version via req.passwordVersion
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validateForgotPasswordCode = async (req, res, next) => {
    const email = req.email;
    const refreshCode = req.body.refreshCode;

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
            return res.status(404).json({ 'message': 'no code generated.' });

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