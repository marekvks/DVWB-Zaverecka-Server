import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const refreshPassword = async (req, res) => {
    const email = req.body.email;
    const refreshCode = req.body.refreshCode;

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
        return res.status(400).json({ message: 'user not found.' });

    try {
        const tokenData = await prisma.refresh_password_tokens.findUnique({
            select: {
                token: true,
                expires_at: true
            },
            where: {
                id_user: user.id_user,
            }
        });
    
        if (!tokenData)
            return res.status(404).json({ 'message': 'no reset password codes were generated.' });
        
        if (tokenData.expires_at < Date.now())
            return res.status(401).json({ 'message': 'code expired.' });

        const matchingToken = await bcrypt.compare(refreshCode, tokenData.token);
        if (matchingToken)
            return res.sendStatus(200);
        else
            return res.status(401).json({'message': 'invalid code.'});
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}