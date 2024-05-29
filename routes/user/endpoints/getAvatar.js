import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAvatar = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = req.user;
    const avatarPath = user.avatarPath;

    if (!avatarPath) {
        return res.status(404).json({ error: 'Avatar not found' });
    }

    const fullPath = path.join(__dirname, 'uploads', avatarPath);

    res.sendFile(fullPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to send file' });
        }
    });
}

export default getAvatar;