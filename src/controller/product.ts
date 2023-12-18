import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { ProductServices } from "../services/ProductServices";
import Product from "../model/product";

export const getAllProducts = errorHandler(async (_request: Request, response: Response) => {
    const data = await ProductServices.getAllProducts();

    return response.status(data.statusCode).json(data);
});

export const getSingleProduct= errorHandler(async (request: Request, response: Response) => {
    const data = await ProductServices.getSingleProduct(request.params.id);

    return response.status(data.statusCode).json(data);
});

export const searchProducts = errorHandler(async (request:Request, response: Response) => {
    const { tags, name } = request.query;
    const query: any = {};

    if (tags) {
        query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }
    
    if (name) {
        const nameString: string = name as string;
        query.name = new RegExp(nameString, 'i');
    }
    
    // Perform the search using the built query
    const products = await Product.find(query);
    
    response.json(products);
})