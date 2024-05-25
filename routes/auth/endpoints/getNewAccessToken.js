import { generateAccessToken } from "./login.js";

export const getNewAccessToken = async (req, res) => {
    const userId = req.user.id;
    const passwordVersion = req.user.pwdVersion;

    const accessToken = generateAccessToken({ id: userId, pwdVersion: passwordVersion});
    res.cookie('accessToken', accessToken, { httpOnly: false, secure: false, path: '/' })
        .status(200)
        .json({ 'accessToken': accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
}