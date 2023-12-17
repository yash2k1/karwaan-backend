import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (error: any, _request: Request, response: Response, next:NextFunction) => {
    if(error){
        return response.status(500).json({
            status: "error",
            statusCode: 500,
            message: error.message || "An unknown error occured",
            data: null
        })
    }
}