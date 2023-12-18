import { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { ProductServices } from "../services/ProductServices";
import Product from "../model/product";
import Order from "../model/order";
import User from "../model/user";

export const addProduct = errorHandler(async (request: Request, response: Response) => {
    const data = await ProductServices.createProduct(request.body);

    return response.status(data.statusCode).json(data);
})

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

export const getAllCustomer = errorHandler(async(request: Request, response: Response) => {
    const orders = await Order.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user_details"
            }
        },
        {$unwind: "$user_details"},
        {
            $project: {
                _id: 1,
                user_details: {
                    userId: "$user_details._id",
                    firstName: "$user_details.firstName",
                    lastName: "$user_details.lastName",
                    email: "$user_details.email",
                    isEmailVerified: "$user_details.isEmailVerified",
                    phoneNumber: "$user_details.phoneNumber",
                    isPhoneNumberVerified: "$user_details.isPhoneNumberVerified"
                }
            }
        }
    ]);
})