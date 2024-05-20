import jwt from "jsonwebtoken";

import { generateAccessToken } from "./login.js";

export const getNewAccessToken = async (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return res.status(404).json({ 'message': 'refresh token not found.' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(500);

        const accessToken = generateAccessToken({ id: user.id });
        res.cookie('accessToken', accessToken, { httpOnly: false, secure: false, path: '/' })
           .status(200)
           .json({ 'accessToken': accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        });
}