import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars');
    },
    filename: async (req, file, cb) => {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user) {
            const fileExtension = path.extname(file.originalname);
            const filename = `${user.username}${fileExtension}`;
            cb(null, filename);
        } else {
            cb(new Error('User not found'), false);
        }
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter
}).single('avatar');