import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getFollowing = async (req, res) => {
    const id = Number(req.params.userId);

    if (isNaN(id))
        return res.status(400).json({ 'message': 'invalid user id.' });

    try {
        const followedUsers = await prisma.user_follow.findMany({
            where: {
                id_follower: id
            },
            select: {
                id_followed: true,
                id_follower: true,
                id_follow: true
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

export default getFollowing;