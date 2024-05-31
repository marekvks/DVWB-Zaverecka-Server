import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const followUser = async (req, res) => {
    const followerId = req.user.id;
    const followedId = Number(req.body.followedId);

    if (isNaN(followedId))
        return res.status(400).json({ 'message': 'invalid followed user id.' });

    try {
        await prisma.user_follow.create({
            data: {
                id_follower: followerId,
                id_followed: followedId
            }
        });

        res.sendStatus(201);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export default followUser;