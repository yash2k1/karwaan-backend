import { NextFunction, Request, Response } from "express";
import { ResponseData } from "../utils/ResponseData";
import jwt from 'jsonwebtoken';

export const verifyAuthentication = async (request: Request, response: Response, next: NextFunction) => {
    try {
        let data;
        //do something here
        const token = request.headers.authorization;
        if(!token){
            data = new ResponseData("error", 400, "Authorization token not available.", null)

            return response.status(data.statusCode).json(data);
        }


    } catch (error) {
        next(error);
    }
}