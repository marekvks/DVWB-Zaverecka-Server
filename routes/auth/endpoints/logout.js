export const logout = async (req, res) => {
    res.cookie('refreshToken', null, { httpOnly: true, secure: false, path: '/' })
        .cookie('accessToken', null, { httpOnly: false, secure: false, path: '/' })
        .status(200)
        .json({ 'message': 'successfully logged out.' });
};