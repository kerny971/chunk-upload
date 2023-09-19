import { NextFunction, Request, Response, Router } from 'express';
import { appendFileSync, existsSync, mkdirSync, unlink, } from 'fs';
import { IncomingForm } from 'formidable';
import { v1 as uuidv1 } from 'uuid';
import path from 'path';
import _ from 'lodash';

import HttpError from '../functions/HttpError';
import { __DIRECTORY_PATH } from '../..';



const router = Router();

    router.get('/', (req: Request, res: Response, next: NextFunction): Response => res.status(200).send({message: 'Upload API !'}));


    router.post('/v2/:path_folder?', async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

        const response: {message: string, statusCode: number, data?: any} = {message: "Une erreur serveur s'est produite...", statusCode: 500};

        try {
            const videoId = await _getRawChunkFromFormidable({req});
            response.data = {videoId};
            response.statusCode = 202;
            response.message = "Fichier correctement transféré !";
        } catch (error: any) {
            console.log(error);
            response.statusCode = error.statusCode ? error.statusCode : response.statusCode;
            response.message = error.statusCode ? error.message : response.message;
        }

        return res.status(response.statusCode).send(response);
    });



    async function _getRawChunkFromFormidable ({req} : {req: Request}): Promise<string> {

        let videoId = req.params.path_folder ?? uuidv1();
        const uploadDir = path.join(__DIRECTORY_PATH, process.env.UPLOAD_DIR!, videoId);

        if (existsSync(uploadDir) === false) mkdirSync(uploadDir);

        const form = new IncomingForm();
        IncomingForm.prototype.onPart = (part: any) => {
            form._handlePart(part);
        }

        form.onPart = function(part: any) {


            if (part.originalFilename) {
                const fileDest = path.join(uploadDir, part.originalFilename);
                part.on('data', (data: any) => {
                    appendFileSync(fileDest, data);
                });
    
                part.on('end', () => {
                });
    
                part.on('error', function(err: any) {
                    __run_job_errors({err, message: "Une erreur serveur s'est produite...", statusCode: 500})
                    unlink(fileDest, (err) => {
                    })
                });
            } else {
                form._handlePart(part);
            }
        }

        await form.parse(req);

        return videoId;

    }


    function __run_job_errors({err, message, statusCode} : {err?: any, message: string, statusCode: number}): undefined {
        if (err) {
            throw new HttpError(statusCode, message);
        }
        return;
    };


export { router as UploadController };