import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const allFromPost = async (req, res) => {
    const { postId } = req.params;

  try {
    const blogPostWithComments = await prisma.blogPost.findUnique({
      where: { id_blogpost: postId },
      include: { comments: true },
    });

    if (!blogPostWithComments) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // take only comments
    const comments = blogPostWithComments.comments;

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default allFromPost;