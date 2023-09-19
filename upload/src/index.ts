// Imports
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { UploadController } from './app/controllers/UploadController';

// Configs
dotenv.config();
const app = express();

// Middlewares Configs
app.use(cors({
    origin: process.env.CORS,
    optionsSuccessStatus: 200
}));

// Constantes
console.log(process.env);
const __DIRECTORY_PATH = process.cwd();
const EXPRESS_PORT = Number(process.env.EXPRESS_PORT);
const EXPRESS_BIND_ADDR = process.env.EXPRESS_BIND_ADDR ?? "127.0.0.1";


// Routing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        message: 'Welcome to the official API !'
    });
})

app.use('/uploads', UploadController);


// Express Settings
const server = app.listen(EXPRESS_PORT, EXPRESS_BIND_ADDR)

export { __DIRECTORY_PATH as __DIRECTORY_PATH }