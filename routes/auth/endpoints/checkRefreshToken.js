import { generateRefreshToken } from "./login.js";

export const checkRefreshToken = (req, res) => {
    const user = req.user;

    let currentTime = Date.now() / 1000;
    let secondsLeft = user.exp - currentTime;
    let hoursLeft = Math.floor(secondsLeft / (60 * 60));

    // 1 week = 168 hours
    if (hoursLeft <= 168) {
        const newRefreshToken = generateRefreshToken({ id: user.id, pwdVersion: user.pwdVersion});
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false, path: '/' })
            .status(201)
            .json({ 'refreshToken': newRefreshToken, expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    }
    else {
        res.status(200).json({ 'message': 'refresh token is still valid.' });
    }
}