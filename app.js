import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';

// api version routers
import apiV1Router from './routes/api/APIv1.js';

// setup
const port = process.env.PORT;
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    'origin': 'http://localhost:3000',
    'credentials': true
}));

// static files
app.use(express.static('public'));

// api version routers
app.use('/api/v1', apiV1Router);


// mail transporter
export const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_EMAIL_PASSWORD
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});