import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import authRouter from './routes/auth/auth.js';
import blogPostRouter from './routes/auth/blogPost.js'
import cookieParser from 'cookie-parser';

const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    'origin': 'http://localhost:3000',
    'credentials': true
}));

app.use('/auth', authRouter);
app.use('/blogPost', blogPostRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});