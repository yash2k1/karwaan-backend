import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { ProductServices } from "../services/ProductServices";
import Product from "../model/product";
import Order from "../model/order";
import User from "../model/user";
import { Types, isObjectIdOrHexString } from "mongoose";
import { ResponseData } from "../utils/ResponseData";

export const addProduct = errorHandler(async (request: Request, response: Response) => {
    const data = await ProductServices.createProduct(request.body);
    return response.status(data.statusCode).json(data);
})

export const updateProduct = errorHandler(async (request: Request, response: Response) => {
    let data;

    if(!isObjectIdOrHexString(request.params.id)){
        data = new ResponseData("error", 400, "Please enter a valid userId", null);
        return response.status(data.statusCode).json(data);
    }

    const productId = new Types.ObjectId(request.params.id);
    const payload = {productId, ...request.body};
    
    data = await ProductServices.updateProduct(payload);
    return response.status(data.statusCode).json(data);
});

export const deleteProduct = errorHandler(async (request: Request, response: Response) => {
    let data;

    if(!isObjectIdOrHexString(request.params.id)){
        data = new ResponseData("error", 400, "Please enter a valid userId", null);
        return response.status(data.statusCode).json(data);
    }

    const productId = new Types.ObjectId(request.params.id);
    const payload = {productId, ...request.body};
    data = await ProductServices.deleteProduct(payload);
    return response.status(data.statusCode).json(data);
});

export const getAllCustomer = errorHandler(async(request: Request, response: Response) => {
    const customers = await Order.aggregate([
        {$lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user_details"
        }},
        {$unwind: "$user_details"},
        {$project: {
            user_details: "$user_details",
        }},
    ]);

    const data = new ResponseData("success", 200, "Success", customers);
    return response.status(data.statusCode).json(data);
});

export const getSingleCustomer = errorHandler(async(request: Request, response: Response) => {
    let data;

    if(!isObjectIdOrHexString(request.params.id)){
        data = new ResponseData("error", 400, "Please enter a valid userId", null);
        return response.status(data.statusCode).json(data);
    }
    
    const userId = new Types.ObjectId(request.params.id);
    const user = await User.findById(userId);
    if(!user){
        data = new ResponseData("error", 400, "User not found", null);
        return response.status(data.statusCode).json(data);
    };

    const orders = await Order.aggregate([
        {$match: {userId: userId}},
        {$lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user_details"
        }},
        {$unwind: "$user_details"},
        {$project: {
            user_details: "$user_details",
        }},
    ]);
    data = new ResponseData("success", 200, "Success", orders)
    return response.status(data.statusCode).json(data);
});