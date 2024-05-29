import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getUserViaUsername = async (req, res) => {
    const username = req.params.username;

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username
            },
            select: {
                id_user: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                password: false
            }
        });

        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Failed to retrieve user:', error);
        return res.sendStatus(500);
    }
}

export default getUserViaUsername;