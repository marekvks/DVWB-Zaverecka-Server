import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const unfollowUser = async (req, res) => {
    const followId = req.params.followId;
    const userId = req.user.id;

    try {
        await prisma.user_follow.delete({
            where: {
                id_follow: followId,
                id_follower: userId
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