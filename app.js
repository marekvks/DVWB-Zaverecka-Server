import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import authRouter from './routes/auth/auth.js';
import blogPostRouter from './routes/blogpost/blogPost.js';
import userRouter from './routes/user/getData.js';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';

const port = process.env.PORT;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    'origin': 'http://localhost:3000',
    'credentials': true
}));

app.use(express.static('public'));

app.use('/auth', authRouter);
app.use('/blogPost', blogPostRouter);
app.use('/user', userRouter);


// mail transporter
export const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});