import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { refreshTokens, users } from '../routes/auth/auth.js'

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

    if (!username || !email || !password)
        return res.status(400).json({ message: 'invalid data.' });

    next();
}

export const userAlreadyExists = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;

    if (users.find(usr => usr.email === email))
        return res.status(400).json({ message: 'email is already in use.' });
    else if (users.find(usr => usr.username === username))
        return res.status(400).json({ message: 'username is already used' });

    next();
}

export const validLoginData = async (req, res, next) => {
    const email = req.body.email;
    const user = users.find(usr => usr.email == email);
    if (!user)
        return res.status(400).json({ message: 'invalid email or password.' });

    const password = req.body.password;
    const matchingPwd = await bcrypt.compare(password, user.password);
    if (!matchingPwd) return res.status(400).json({ message: 'invalid email or password.' });

    req.user = user;
    next();
}

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}

export const generateRefreshToken = (user) => {
    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(token);
    console.log(token);
    return token;
}