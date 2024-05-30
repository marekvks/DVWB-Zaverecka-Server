import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { getPath } from './getUserAvatar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getAvatar = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'unauthorized.' });
    }

    const user = req.user;
    const avatarPath = req.user.avatarPath;

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

export default getAvatar;