import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
}

export const generateRefreshToken = (user) => {
    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    return token;
}

const login = async (req, res) => {
    const userId = req.userId;

    const accessToken = generateAccessToken({ id: userId, pwdVersion: req.passwordVersion });
    const refreshToken = generateRefreshToken({ id: userId, pwdVersion: req.passwordVersion });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, path: '/' })
       .cookie('accessToken', accessToken, { httpOnly: false, secure: false, path: '/' })
       .json({ refreshTokenExpiresAt: process.env.REFRESH_TOKEN_EXPIRATION });
}

export default login;