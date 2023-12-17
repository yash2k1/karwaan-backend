import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { ResponseData } from "../utils/ResponseData";
import fileUpload from "express-fileupload";
import sharp from "sharp";

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

export const uploadMedia = errorHandler(async (request: Request, response: Response) => {
    let data;

    const uploadedFiles = request.files;

    // adding checks for file validation 
    if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
        data = new ResponseData("error", 400, "Please upload a file to continue", null);
        return response.status(data.statusCode).json(data);
    }

    const fileKeys = Object.keys(uploadedFiles);

    if (fileKeys.length > 1) {
        data = new ResponseData("error", 400, "Please upload a single file at a time", null);
        return response.status(data.statusCode).json(data);
    }

    const fileKey = fileKeys[0];
    const file = uploadedFiles[fileKey] as fileUpload.UploadedFile;

    // validating the mimetype of the uploaded file 
    const imageAndVideoMimeTypes: string[] = [
        'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-flv'
    ];

    if (!imageAndVideoMimeTypes.includes(file.mimetype)) {
        data = new ResponseData("error", 400, "Please enter a valid image or video", null);
        return response.status(data.statusCode).json(data);
    }

    // Adding a watermark on the image
    const fileBuffer = file.data;
    const watermarkBuffer = await sharp('./public/watermark.png').toBuffer()

    const fileMetadata = await sharp(fileBuffer).metadata();

    // setting a custom width for the watermark over image 
    const targetWidth = Math.floor(fileMetadata.width as number * 0.8);

    // resizing the watermark on the image 
    const resizeWatermark = await sharp(watermarkBuffer)
        .resize({width: targetWidth, fit: 'contain'})
        .toBuffer().catch((error => {
            console.log(error)
        }))
    
    // merging both images 
    const mergedFile = await sharp(fileBuffer)
        .composite([{input: resizeWatermark as Buffer, gravity: 'center', blend: 'over'}])
        .toBuffer().catch((error => {
            console.log(error)
        }))

    // const uploadFileToCloudinary = cloudinary.uploader.upload_stream(
    //     {
    //         resource_type: 'image',
    //         public_id: `Image-public-id-${Date.now()}-${(new Date()).getSeconds()}-${(new Date()).getSeconds()}`,
    //         format: 'jpeg', // Specify the format if needed
    //     },
    //     (error, result) => {
    //         if (error) {
    //             console.error(error);
    //             data = new ResponseData("error", 400, error.message, null);
    //         } else {
    //             console.log(result);
    //             data = new ResponseData("success", 200, "Successfully uploaded a file", result);
    //         }
    //         response.status(data.statusCode).json(data);
    //     }
    // ).end(mergedFile);
        
    // console.log(uploadFileToCloudinary);

    // response.send(uploadFileToCloudinary);
        data = new ResponseData("success", 200, "Something here", mergedFile)
        return response.status(data.statusCode).json(data);
});

