export const logout = async (req, res) => {
    res.cookie('refreshToken', null, { httpOnly: true, secure: false, path: '/' })
                .status(200)
                .json({ 'message': 'successfully logged out.' });
};