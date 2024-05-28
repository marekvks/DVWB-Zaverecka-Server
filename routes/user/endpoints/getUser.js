import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getUser = async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id))
        return res.status(400).json({ 'message': 'invalid id.' });

    try {
        const user = await prisma.user.findFirst({
            where: {
                id_user: id
            },
            select: {
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

export default getUser;