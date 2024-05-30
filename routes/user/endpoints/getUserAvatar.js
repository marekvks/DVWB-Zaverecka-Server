import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getUserAvatar = async (req, res) => {
    const id = Number(req.params.id);

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
        return res.status(404).json({ error: 'user not found.' });
    }

    const avatarPath = user.avatarPath;

    let fullPath = "";

    if (!avatarPath) fullPath = getPath('avatar-default.jpg');
    else fullPath = getPath(avatarPath);


    if (!fs.existsSync(fullPath)) {
        fullPath = getPath('avatar-default.jpg');
    }

    res.sendFile(fullPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'failed to send file.' });
        }
    });
}

export const getPath = (filename) => {
    return path.join(__dirname, '..', '..', '..', 'uploads', 'avatars', filename);
}

export default getUserAvatar;