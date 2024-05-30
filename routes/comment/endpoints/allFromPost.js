import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const allFromPost = async (req, res) => {
    const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { id_blogpost: postId },
      select: {
        id_comment: true,
        content: true,
        date: true,
        id_author: true,
      }
    });

    if (!comments) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default allFromPost;