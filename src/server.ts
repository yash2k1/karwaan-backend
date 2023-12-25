import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload'
import cors from 'cors'
import Logger from './utils/Logger';
import Routes from './routes/_index';
import { connectDB } from '../config/connectDB';
import { initializeModel } from './model/_index';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import Razorpay from 'razorpay';

dotenv.config({path: './config/.env'});

const app = express();
const PORT = process.env.PORT || 2022;

initializeModel();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(cors());

export const razorPayInstance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID!, 
    key_secret: process.env.RAZOR_PAY_SECRET_KEY!
});

app.listen(PORT, async () => {
    try {
        app.use(Routes);
        app.use('*', globalErrorHandler);
        Logger.info(`⚡Successfully connected to http://localhost:${PORT}`); 
        await connectDB();
    } catch (error: any) {
        Logger.error(error.message);
    }
})