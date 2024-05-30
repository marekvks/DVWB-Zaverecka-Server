import express from 'express';
import authRouter from '../auth/auth.js';
import blogPostRouter from '../blogpost/blogPost.js';
import userRouter from '../user/user.js';
import commentRouter from '../comment/comment.js'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/blogPost', blogPostRouter);
router.use('/user', userRouter);
router.use('/comment', commentRouter);

export default router;