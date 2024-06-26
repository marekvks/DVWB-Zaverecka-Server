import 'dotenv/config.js';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { transporter } from '../../../app.js';

const requestRefreshPassword = async (req, res) => {
    const email = req.email;

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
                expires_at: Date.now() + (process.env.REFRESH_PASSWORD_TOKEN_EXPIRATION * 60 * 1000),
                used: false
            },
            create: {
                id_user: user.id_user,
                token: hashedToken,
                expires_at: Date.now() + (process.env.REFRESH_PASSWORD_TOKEN_EXPIRATION * 60 * 1000),
                used: false
            }
        });

        const info = await transporter.sendMail({
            from: `"BlogPost Server 🤓" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: 'Reset password',
            text: `Here's your code for resetting forgotten password: ${token}\n\nDo NOT reply to this email.`,
        });

        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const generateRandomToken = () => {
    let token = 0;
    while (token <= 0)
        token = Math.round(Math.random() * (999999 - 100000 + 1)) + 100000;

    return token;
}

export default requestRefreshPassword;