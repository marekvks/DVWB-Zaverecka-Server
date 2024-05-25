import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updatePassword = async (req, res) => {
    const userId = req.id_user;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const passwordVersion = req.passwordVersion;

    if (password != confirmPassword)
        return res.status(400).json({ 'message': 'passwords don\'t match' });

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.update({
            where: {
                id_user: userId
            },
            data: {
                password: hashedPassword,
                passwordVersion: passwordVersion + 1
            }
        });

        await prisma.refresh_password_tokens.update({
            where: {
                id_user: userId
            },
            data: {
                used: true
            }
        });

        res.sendStatus(204);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export default updatePassword;