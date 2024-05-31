import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getFollowedUsers = async (req, res) => {
    const id = req.params.userId;

    try {
        await prisma.user_follow.findMany({
            where: {
                id_follower: id
            },
            select: {
                id_followed: true,
                id_followed: true
            }
        });

        if (!followedUsers || followedUsers.length <= 0) {
            return res.status(404).json({ 'message': 'no followed users found.' });
        }

        res.status(200).json(followedUsers);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export default getFollowedUsers;