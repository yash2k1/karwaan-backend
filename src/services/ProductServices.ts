import { Types } from "mongoose";
import Product from "../model/product";
import User from "../model/user";
import { ResponseData } from "../utils/ResponseData";

type CreateProductParam = {
    userId: string;
    name: string;
    tags: string[];
    description: string;
    price: number;
    linkToMedia: string;
    isFreeToUse: boolean
}

type UpdateProductPayload = {
    userId: string;
    name: string;
    tags: string[];
    description: string;
    price: number;
    linkToMedia: string;
    isFreeToUse: boolean;
    productId: Types.ObjectId;
}

type DeleteProductPayload = {
    productId: Types.ObjectId;
    userId: string;
}

export class ProductServices {
    static async createProduct(payload: CreateProductParam) {
        try {
            let data;
            const {userId, name, tags, description, price, linkToMedia, isFreeToUse} = payload;

            if(!userId || !name || !tags || !description || !price || !linkToMedia){
                data = new ResponseData("error", 400, "Invalid payload", null);
                return data;
            }
        
            const user = await User.findById(userId);

            if(!user){
                data = new ResponseData("error", 400, "User not found", null);
                return data
            }

            if(user.role === "user"){
                data = new ResponseData("error", 400, "You cannot access this resourse", null);
                return data;
            }

            const newProduct = await Product.create({
                userId: userId, 
                name: name,
                tags: tags,
                description: description,
                price: price,
                linkToMedia: linkToMedia,
                isFreeToUse: isFreeToUse 
            });

            data = new ResponseData("success", 200, "Product added successfully", newProduct);
            return data;
        } catch (error) {
            throw error
        }
        
    }
    
    static async getAllProducts () {
        try {
            let data;
            const products = await Product.find();
            
            data = new ResponseData("success", 200, "Success", products);
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getSingleProduct (payload: Types.ObjectId) {
        let data;
        const product = await Product.findById(payload);

        if(!product){
            data = new ResponseData("error", 400, "Prodcut not found", null);
            return data;
        }
        
        data = new ResponseData("success", 200, "Success", product);
        return data;
    }

    static async updateProduct (payload: UpdateProductPayload) {
        let data;

        const {userId, name, tags, description, price, linkToMedia, isFreeToUse, productId} = payload;

        if(!userId || (!name && !tags && !description && !price && !linkToMedia)){
            data = new ResponseData("error", 400, "Invalid payload", null);
            return data;
        }

        const user = await User.findById(userId);
        
        if(!user){
            data = new ResponseData("error", 400, "User not found", null);
            return data
        }

        if(user.role === "user"){
            data = new ResponseData("error", 400, "You cannot access this resourse", null);
            return data;
        }

        const product = await Product.findByIdAndUpdate(productId, {$set: {
            userId: userId,
            name: name,
            tags: tags,
            description: description,
            price: price,
            linkToMedia: linkToMedia,
            isFreeToUse: isFreeToUse 
        }}, {new: true});

        if(!product){
            data = new ResponseData("error", 400, "Prodcut not found", null);
            return data;
        }
        
        data = new ResponseData("success", 200, "Success", product);
        return data;
    }

    static async deleteProduct (payload: DeleteProductPayload) {
        let data;

        const {productId, userId} = payload;

        if(!userId){
            data = new ResponseData("error", 400, "Invalid payload", null);

            return data;
        }
        
        const product = await Product.findByIdAndDelete(productId);

        const user = await User.findById(userId);
        
        if(!user){
            data = new ResponseData("error", 400, "User not found", null);

            return data
        }

        if(user.role === "user"){
            data = new ResponseData("error", 400, "You cannot access this resourse", null);

            return data;
        }

        if(!product){
            data = new ResponseData("error", 400, "Prodcut not found", null);

            return data;
        }
        
        data = new ResponseData("success", 200, "Success", null);
        return data;
    }
}