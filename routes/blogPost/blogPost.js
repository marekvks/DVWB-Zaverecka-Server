import express from "express";
import { PrismaClient } from '@prisma/client'
import {getRandomBlogPosts, validateData} from '../../middleware/blogPost.js';
import {verifyAccessToken} from '../../middleware/auth.js';

const prisma = new PrismaClient();

const router = express.Router();


router.get('/blogPost', getRandomBlogPosts, async (req, res) => {
    res.send(res.locals);
});

router.get('/blogPostTitle/:title', async(req, res) => {
    const blogPosts = await prisma.blogPost.findMany({
        where:{
            title: req.params.title
        }
    });

    res.send(blogPosts);
});

router.get('/blogPostUser/:user', async(req, res) => {
    const test = await prisma.blogPost.findMany({
        where: {
            autohor: {
                username: req.params.user
            }
        }
    })

    res.send(test);
});

router.get('/blogPost/:id_blogpost', async (req, res) => {
    const blogPost = await prisma.blogPost.findFirst({
        where:{
            id_blogpost: req.params.id_blogpost
        }
    });
    res.send(blogPost);
});

router.patch('/blogPost/:id', async (req, res) => {

    const object = res.locals;

    await prisma.blogPost.update({
        where:{
            id_blogpost: req.params.id
        },
        data:{
            title: req.body.title,
            content: req.body.content
        }
    })

    res.sendStatus(200);
});

router.post('/blogPost', verifyAccessToken, async(req, res) => {

    const title = req.body.title;
    const description = req.body.description;
    const content = req.body.content;
    const id_author = req.user.id;
    const categoryName = req.body.categoryName;

    await prisma.blogPost.create({
        data:{
            title: title,
            description: description,
            content: content,
            id_author: id_author
        }
    });

    res.sendStatus(201);
});

router.delete('/blogPost/:id', async(req, res) => {
    await prisma.blogPost.deleteMany({
        where:{
            id_blogpost: req.params.id
        }
    })

    res.sendStatus(200);
});
    

export default router;