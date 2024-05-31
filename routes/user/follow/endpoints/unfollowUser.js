import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const unfollowUser = async (req, res) => {
    const followedId = Number(req.params.followId);
    const userId = req.user.id;

    if (isNaN(followedId))
        return res.status(400).json({ 'message': 'invalid followed user id.' });

    try {
        const follow = await prisma.user_follow.findFirst({
            where: {
                id_follower: userId,
                id_followed: followedId
            },
            select: {
                id_follow: true
            }
        });

        if (!follow)
            return res.status(400).json({ 'message': 'invalid data.' });

        await prisma.user_follow.delete({
            where: {
                id_follow: follow.id_follow
            }
        });

        res.sendStatus(204);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export default unfollowUser;