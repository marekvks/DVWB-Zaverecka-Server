import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getUserAvatar = async (req, res) => {
    /*const id = Number(req.params.id);

    if (isNaN(id))
        return res.status(400).json({ 'message': 'invalid id.' });

    const user = await prisma.user.findFirst({
        select: {
            avatarPath: true
        },
        where: {
            id_user: id
        }
    })
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const avatarPath = user.avatarPath;

    if (!avatarPath) {
        return res.status(404).json({ error: 'Avatar not found' });
    }*/

    const fullPath = path.join(__dirname, '..', '..', '..', 'uploads', 'avatars', 'racoon.png');

    res.sendFile(fullPath, (err) => {
        if (err) {
            console.error(err);
            // res.status(500).json({ error: 'Failed to send file' });
        }
    });
}

export default getUserAvatar;