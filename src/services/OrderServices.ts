import Order from "../model/order";
import Product from "../model/product";
import User from "../model/user";
import { ResponseData } from "../utils/ResponseData";
import { generateCryptoId } from "../utils/generateCryptoId";
import { PaymentServices } from "./PaymentServices";
import { UserServices } from "./UserServices";

type CreateOrderPayload = {
    userId: string;
    productId: string;
}

export class OrderServices {
    static async createOrder(payload: CreateOrderPayload) {
        let data;
        const {userId, productId} = payload;

        if(!userId || !productId){
            data = new ResponseData("error", 400, "Invalid payload", null);

            return data;
        }

        const user = await User.findById(userId);

        if(!user){
            data = new ResponseData("error", 400, "User not found", null);

            return data;
        }

        const product = await Product.findById(productId);

        if(!product){
            data = new ResponseData("error", 400, "Product not found", null);

            return data;
        }

        const orderId = generateCryptoId();
        const razorPayOrder = await PaymentServices.createOrder(product?.price, orderId);
        
        const newOrder = await Order.create({
            userId: userId,
            productId: productId,
            status: 'PAYMENT PENDING',
            download_url: null
        });

        const returnData = {
            order_details: newOrder, 
            payment_details: razorPayOrder
        }

        data = new ResponseData("success", 200, "Order generated", returnData);

        return data;
    };
}