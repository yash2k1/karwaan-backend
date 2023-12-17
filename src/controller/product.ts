import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { ProductServices } from "../services/ProductServices";

export const createProduct = errorHandler(async (request: Request, response: Response) => {
    const data = await ProductServices.createProduct(request.body);

    return response.status(data.statusCode).json(data);
});

export const getAllProducts = errorHandler(async (_request: Request, response: Response) => {
    const data = await ProductServices.getAllProducts();

    return response.status(data.statusCode).json(data);
});

export const getSingleProduct= errorHandler(async (request: Request, response: Response) => {
    const data = await ProductServices.getSingleProduct(request.params.id);

    return response.status(data.statusCode).json(data);
});

export const updateProduct = errorHandler(async (request: Request, response: Response) => {
    const payload = {...request.params, ...request.body}
    const data = await ProductServices.updateProduct({...request.params, ...request.body});
    
    return response.status(data.statusCode).json(data);
});

export const deleteProduct = errorHandler(async (request: Request, response: Response) => {
    const payload = {...request.params, ...request.body}
    const data = await ProductServices.deleteProduct(payload);

    return response.status(data.statusCode).json(data);
});