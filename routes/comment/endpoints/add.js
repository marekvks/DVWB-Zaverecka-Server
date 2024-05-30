import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const add = async (req, res) => {

    const { postId } = req.body;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        //check user
        const user = await prisma.user.findUnique({
        where: { id_user: userId },
        });
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        // Check post
        const blogPost = await prisma.blogPost.findUnique({
        where: { id_blogpost: postId },
        });
        if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
        }

        // Create comment
        const newComment = await prisma.comment.create({
        data: {
            content,
            id_author: userId,
            id_blogpost: postId,
        },
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export default add;