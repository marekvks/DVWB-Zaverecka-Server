import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default getUsersBlogposts = async (req, res) => {
    const userId = req.params.id;

    try {
        const blogPosts = await prisma.blogPost.findMany({
            where: {
                id_author: userId
            }
        });

        if (!blogPosts || blogPosts.length <= 0)
            return res.status(404).json({ message: 'no blogposts found.' });

        res.status(200).json(blogPosts);
    }
    catch (error)
    {
        console.error(error);
        res.sendStatus(500);
    }
}