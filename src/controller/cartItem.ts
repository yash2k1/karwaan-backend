import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { CartItemServices } from "../services/CartItemServices";

export const addItemToCart = errorHandler(async (request: Request, response: Response) => {
    const data = await CartItemServices.addItemToCart(request.body);

    return response.status(data.statusCode).json(data);
})
export const removeItemFromCart = errorHandler(async (request: Request, response: Response) => {
    const payload = {...request.params, ...request.body}
    const data = await CartItemServices.removeItemFromCart(payload);

    return response.status(data.statusCode).json(data);
})
export const getAllCartItems = errorHandler(async (request: Request, response: Response) => {
    const data = await CartItemServices.getAllCartItems(request.params.id);

    return response.status(data.statusCode).json(data);
})
export const emptyCart = errorHandler(async (request: Request, response: Response) => {
    const payload = {...request.params, ...request.body}
    const data = await CartItemServices.addItemToCart(payload);

    return response.status(data.statusCode).json(data);
})