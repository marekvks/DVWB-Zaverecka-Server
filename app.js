import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import authRouter from './routes/auth/auth.js';

const port = process.env.PORT;

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors({
    'origin': '*'
}));

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});