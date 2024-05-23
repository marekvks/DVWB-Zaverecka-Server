import 'dotenv/config.js';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { transporter } from '../../../app.js';

export const requestRefreshPassword = async (req, res) => {
    const email = req.body.email;
    // TODO: validate email

    const user = await prisma.user.findFirst({
        select: {
            id_user: true
        },
        where: {
            email: email
        }
    });

    if (!user)
        return res.status(404).json({ 'message': 'user not found.' });

    const token = generateRandomToken();
    const hashedToken = await bcrypt.hash(token.toString(), 10);

    try {
        await prisma.refresh_password_tokens.upsert({
            where: {
                id_user: user.id_user
            },
            update: {
                id_user: user.id_user,
                token: hashedToken,
                expires_at: Date.now() + (process.env.REFRESH_PASSWORD_TOKEN_EXPIRATION * 60 * 1000)
            },
            create: {
                id_user: user.id_user,
                token: hashedToken,
                expires_at: Date.now() + (process.env.REFRESH_PASSWORD_TOKEN_EXPIRATION * 60 * 1000)
            }
        });

        const info = await transporter.sendMail({
            from: `"BlogPost Server 🤓" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Test email',
            text: `Your code for refreshing your password: ${token}\n\nDo NOT reply to this email.`,
        });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const generateRandomToken = () => {
    let token = 0;
    while (token <= 0)
        token = Math.round(Math.random() * 999999);

    return token;
}