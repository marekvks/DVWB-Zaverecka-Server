import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const register = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword
        }
    });

    res.sendStatus(201);
}