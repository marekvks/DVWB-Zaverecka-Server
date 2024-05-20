import jwt from "jsonwebtoken";
import { generateRefreshToken } from "./login.js";

export const checkRefreshToken = (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return res.status(404).json({ 'message': 'refresh token not found.' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(500);

        let currentTime = Date.now() / 1000;
        let secondsLeft = user.exp - currentTime;
        let hoursLeft = Math.floor(secondsLeft / (60 * 60));
        console.log(hoursLeft);

        // 1 week
        if (hoursLeft <= 168) {
            const newRefreshToken = generateRefreshToken({ id: user.id });
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false, path: '/' })
                .status(201)
                .json({ 'refreshToken': newRefreshToken, expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
        }
        else {
            res.status(200).json({ 'message': 'refresh token is still valid.' });
        }
    });
}