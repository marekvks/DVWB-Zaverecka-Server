import express from "express";
import { PrismaClient } from '@prisma/client'
import {getRandomBlogPosts, validateData} from '../../middleware/blogPost.js';
import {validateAccessToken} from '../../middleware/auth.js';

const prisma = new PrismaClient();

const router = express.Router();

import getUsersBlogposts from "./endpoints/getUsersBlogposts.js";


router.get('/', getRandomBlogPosts, async (req, res) => {
    res.send(res.locals);
});

router.get('/user/:id', getUsersBlogposts);

router.get('/blogPostTitle/:title', async(req, res) => {
    
    try{
        const blogPosts = await prisma.blogPost.findMany({
            where:{
                title: {contains: req.params.title,  mode: 'insensitive'}
            }
        });

        res.send(blogPosts);
    }
    catch(error){
        console.error(error);
        res.sendStatus(500);
    }

    
});

router.get('/blogPostUser/:user', async(req, res) => {

    try{
        const user = await prisma.blogPost.findMany({
            where: {
                author: {
                    username: req.params.user
                }
            }
        })
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        res.send(user);
    }
    catch(error){
        console.error(error);
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {

    try{
        const blogPost = await prisma.blogPost.findFirst({
            where:{
                id_blogpost: req.params.id
            }
        });
    
        if (blogPost == null) {
            return res.status(404).json({ error: 'BlogPost not found' });
        }
    
        res.status(200).send(blogPost);
    }
    catch (error){
        console.error(error);
        res.sendStatus(500);
    }

    
});

router.patch('/:id', validateAccessToken, validateData, async (req, res) => {
    try{

    await prisma.blogPost.update({
        where:{
            id_blogpost: req.params.id
        },
        data:{
            title: req.body.title,
            description: req.body.description,
            content: req.body.content
        }
    })

    res.sendStatus(200);
    }
    catch(error){
        console.error(error);
        res.sendStatus(500);
    }
});

router.patch('/addLike/:id', validateAccessToken, async(req, res) => {
    try{
    
    await prisma.blogPost.update({
        where:{
            id_blogpost: req.params.id
        },
        data:{
           likes: { value: { increment: 1 } }
        }
    })

    res.sendStatus(200);
    }
    catch(error){

    }
});

router.post('/', validateAccessToken, async(req, res) => {

    try{
        let title = req.body.title;
        let description = req.body.description;
        let content = req.body.content;
        let id_author = req.user.id;

        if(title == '' || description == ''|| content == ''){
          return res.sendStatus(401);
        }

     await prisma.blogPost.create({
          data:{
               title: title,
               description: description,
                content: content,
               id_author: id_author
          }
        });

        res.sendStatus(201);
    }
    catch(error){
        console.error(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', async(req, res) => {

    try{
        await prisma.blogPost.deleteMany({
            where:{
                id_blogpost: req.params.id
            }
        })
    
        res.sendStatus(200);
    }
    catch(error){
        console.error(error);
        res.sendStatus(500);
    }
});
    

export default router;