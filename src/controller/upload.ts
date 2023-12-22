import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { ResponseData } from "../utils/ResponseData";
import fileUpload from "express-fileupload";

export const uploadMedia = errorHandler(async (request: Request, response: Response) => {
    let data;

    const uploadedFiles = request.files;

    // adding checks for file validation 
    if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
        data = new ResponseData("error", 400, "Please upload a file to continue", null);
        return response.status(data.statusCode).json(data);
    }

    let files;

    // for (const key of uploadedFiles){
    //     files = uploadedFiles[key];
    // }

    // if(Array.isArray())

    // // validating the mimetype of the uploaded file 
    // const imageAndVideoMimeTypes: string[] = [
    //     'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml',
    //     'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-flv'
    // ];

    // if (!imageAndVideoMimeTypes.includes(file.mimetype)) {
    //     data = new ResponseData("error", 400, "Please enter a valid image or video", null);
    //     return response.status(data.statusCode).json(data);
    // }

;
        data = new ResponseData("success", 200, "Something here", uploadedFiles)
        return response.status(data.statusCode).json(data);
});

