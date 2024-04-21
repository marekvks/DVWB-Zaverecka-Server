import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const getRandomBlogPosts = async (req, res, next) =>{
    const blogPosts = await prisma.blogPost.findMany();
    let randomBlogPosts = [];

    if(blogPosts.length != 0){

        let randomBlogPostsCount = 10;

        if(blogPosts.length < 10){
            randomBlogPostsCount = blogPosts.length;
        }

        for(let i = 0; i < randomBlogPostsCount; i++){
            const random = Math.floor(Math.random() * blogPosts.length);
    
            if(!randomBlogPosts.includes(blogPosts[random])){
                randomBlogPosts.push(blogPosts[random]);
            }else{
                i--;
            }
        }
    }

    res.locals = randomBlogPosts;
    next();
}

export const dataToUpdate = async(req, res, next) => {

    const title = req.body.title;
    const content = req.body.content;
    let object = {};

    if(title == null){
        if(content != null) object = {content};
    }else if(content == null){
        if(title != null) object = {title};
    }else{
        object = {title, content};
    }

    req.locals = object;

    next();
}

export const validateData = async (req, res, next) => {
    next();
}
