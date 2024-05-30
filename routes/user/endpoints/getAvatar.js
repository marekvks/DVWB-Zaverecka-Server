import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getAvatar = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'unauthorized.' });
    }

    const user = req.user;
    const avatarPath = req.user.avatarPath;

    if (!avatarPath) {
        return res.status(404).json({ error: 'avatar not found.' });
    }
    
    const fullPath = path.join(__dirname, '..', '..', '..', 'uploads', 'avatars', avatarPath);
    
    if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'avatar not found.' });
    }

    res.sendFile(fullPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'failed to send file.' });
        }
    });
}

export default getAvatar;