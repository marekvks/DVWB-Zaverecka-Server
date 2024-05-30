import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars');
    },
    filename: async (req, file, cb) => {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: {
                id_user: userId
            }
        });

        if (user) {
            const fileExtension = path.extname(file.originalname);
            const filename = `${uuid()}${fileExtension}`;
            req.filename = filename;
            cb(null, filename);
        } else {
            cb(new Error('User not found'), false);
        }
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
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
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
}).single('avatar');