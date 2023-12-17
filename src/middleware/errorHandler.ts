import { NextFunction, Request, Response } from "express";

export const errorHandler = (controller: any) =>  async(request: Request, response: Response, next: NextFunction) => {
    try {
        controller(request, response);
    } catch (error: any) {
        next(error)
    }
}