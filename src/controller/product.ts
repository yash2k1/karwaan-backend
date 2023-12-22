import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { ProductServices } from "../services/ProductServices";
import Product from "../model/product";
import { Types, isObjectIdOrHexString } from "mongoose";
import { ResponseData } from "../utils/ResponseData";

export const getAllProducts = errorHandler(async (_request: Request, response: Response) => {
    const data = await ProductServices.getAllProducts();

    return response.status(data.statusCode).json(data);
});

export const getSingleProduct= errorHandler(async (request: Request, response: Response) => {
    let data;

    if(!isObjectIdOrHexString(request.params.id)){
        data = new ResponseData("error", 400, "Please upload a valid id", null);
        return response.status(data.statusCode).json(data);
    }

    const productId = new Types.ObjectId(request.params.id);
    data = await ProductServices.getSingleProduct(productId);
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