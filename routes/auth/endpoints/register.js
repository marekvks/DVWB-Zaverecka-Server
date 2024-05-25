import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const register = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                passwordVersion: 0
            }
        });

        res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}