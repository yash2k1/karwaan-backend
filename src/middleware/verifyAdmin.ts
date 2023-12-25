import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { ResponseData } from "../utils/ResponseData";
import User, { UserInterface } from "../model/user";


export const verifyAdmin = (request: Request, response: Response, next: NextFunction) => {
    let data;
    const token = request.header('Authorization');

    if (!token) {
        data = new ResponseData("error", 400, "Unauthorized: Missing token", null);
        return response.status(data.statusCode).json(data);
    }
  
    jwt.verify(token, process.env.JWT_SECRET as string, async (error, userEmail) => {
        if (error) {
            data = new ResponseData("error", 400, "Unauthorized: Invalid token", null);
            return response.status(data.statusCode).json(data);
        }
        
        const user = await User.findOne({email: userEmail});
        
        if(!user){
            data = new ResponseData("error", 400, "Unauthorized: Invalid token", null);
            return response.status(data.statusCode).json(data);
        }

        if(user?.role === "user"){
            data = new ResponseData("error", 400, "Unauthorized: Cannot access this resource", null);
            return response.status(data.statusCode).json(data);
        }
        next();
    });
}