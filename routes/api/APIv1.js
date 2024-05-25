import express from 'express';
import authRouter from '../auth/auth.js';
import blogPostRouter from '../blogpost/blogPost.js';
import userRouter from '../user/getData.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/blogPost', blogPostRouter);
router.use('/user', userRouter);

export default router;