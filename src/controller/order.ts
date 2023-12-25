import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { OrderServices } from "../services/OrderServices";

export const createOrder = errorHandler(async (request:Request, response: Response) => {
    const data = await OrderServices.createOrder(request.body);
    return response.status(data.statusCode).json(data);
});

export const updateOrderPaymentStatus = errorHandler(async (request: Request, response: Response) => {
    const data = await OrderServices.updateOrderStatus(request.params.id);
    return response.status(data.statusCode).json(data);
});