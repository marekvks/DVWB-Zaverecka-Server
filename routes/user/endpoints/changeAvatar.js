import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const changeAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id_user: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fileExtension = path.extname(req.file.originalname);
        const filename = req.filename;

        await prisma.user.update({
            where: { id_user: userId },
            data: { avatarPath: filename }
        });

        res.status(200).json({ message: 'Avatar updated successfully', avatar: filename });
    } catch (error) {
        console.error("Failed to update avatar:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
};

export default changeAvatar;