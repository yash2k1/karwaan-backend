import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { ProductServices } from "../services/ProductServices";
import Product from "../model/product";
import { Types, isObjectIdOrHexString } from "mongoose";
import { ResponseData } from "../utils/ResponseData";

export const getAllProducts = errorHandler(async (request: Request, response: Response) => {
    let data: ResponseData;
    let products;

    const type = request.query.type as string;
    const tag = request.query.tag as string;
    const searchQuery = request.query.q as string;

    if (type) {
        if (type !== 'image' && type !== 'video') {
            data = new ResponseData("error", 400, `${type} is not a valid type`, null);
            return response.status(data.statusCode).json(data);
        }

        products = await Product.find({ 'media.type': type });
        data = new ResponseData("success", 200, "Success", products);
        return response.status(data.statusCode).json(data);
    }

    if (tag) {
        const validTags = ['landscape', 'cityscape', 'dark', 'people', 'uncategorized'];

        if (!validTags.includes(tag)) {
            data = new ResponseData("error", 400, `${tag} is not a valid tag.`, null);
            return response.status(data.statusCode).json(data);
        }

        products = await Product.find({ tags: { $in: [tag] } });
        data = new ResponseData("success", 200, "Success", products);
        return response.status(data.statusCode).json(data);
    }

    if (searchQuery) {
            products = await Product.find({
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                ]
            });

            data = new ResponseData("success", 200, "Success", products);
            return response.status(data.statusCode).json(data);
        }

    products = await Product.find();
    data = new ResponseData("success", 200, "Success", products);
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