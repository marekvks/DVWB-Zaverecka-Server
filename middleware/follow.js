import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const alreadyFollowing = async (req, res, next) => {
    const followerId = req.user.id;
    const followedId = Number(req.body.followedId);

    if (isNaN(followedId))
        return res.status(400).json({ 'message': 'invalid followed user id.' });

    try {
        const followedUser = await prisma.user_follow.findFirst({
            where: {
                id_follower: followerId,
                id_followed: followedId
            },
            select: {
                id_follow: true
            }
        });

        if (followedUser && followedUser.id_follow)
            return res.status(409).json({ 'message': 'already following this user.' });

        next();
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}