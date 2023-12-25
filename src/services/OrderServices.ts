import Order from "../model/order";
import Product from "../model/product";
import User from "../model/user";
import { ResponseData } from "../utils/ResponseData";
import { PaymentServices } from "./PaymentServices";
import AWS from 'aws-sdk'

type CreateOrderPayload = {
    userId: string;
    products: string[];
}

const s3 = new AWS.S3;

export class OrderServices {
    static async createOrder(payload: CreateOrderPayload) {
        let data;
        const {userId, products} = payload;

        if(!userId || !products){
            data = new ResponseData("error", 400, "Invalid payload", null);
            return data;
        }

        if(products.length === 0){
            return new ResponseData("error", 400, "You have selected no products", null);
        }

        const user = await User.findById(userId);

        if(!user){
            data = new ResponseData("error", 400, "User not found", null);
            return data;
        }

        let totalAmount = 0;
        for(let productId in products){
            const product = await Product.findById(productId);
            
            if(!product){
                data = new ResponseData("error", 400, "Product not found", null);
                return data;
            }

            totalAmount += product.price
        }

        let newOrderObj = new Order({
            userId: userId,
            products: products,
            status: 'PAYMENT PENDING',
            amount: totalAmount,
            download_url: null
        });
                
        const newOrder = await newOrderObj.save();

        const razorpayPayment = await PaymentServices.createPaymentLink(totalAmount, newOrder?._id);
        if(!razorpayPayment){
            return new ResponseData("error", 400, "There was an error while making a payment please try again", null);
        }

        await newOrder.updateOne({
            payment_id: razorpayPayment?.id
        });

        await newOrder.save();

        const returnData = {
            order_details: newOrder, 
            payment_details: razorpayPayment
        }

        data = new ResponseData("success", 200, "Order generated", returnData);
        return data;
    };

    static updateOrderStatus = async (order_id: string) => {
        const order = await Order.findById(order_id);
        if(!order){
            return new ResponseData("error", 400, "Order not found", null);
        }
        
        const payment = await PaymentServices.fetchStandardPaymentLinkById(order.payment_id);
        if(!payment){
            return new ResponseData("error", 400, "No payment details were found", null);
        }

        let imageUrl: string[] = [];
        for(let i in order.products){
            const productId = order.products[i];
            const product = await Product.findById(productId);
            if(!product){
                return new ResponseData("error", 400, "Product not found", null);
            }

            const binaryData = Buffer.from(product.media.data, 'base64');
            const uploadParams = {
                Bucket: 'bucketName',
                Key: `${order_id}_${Date.now()}`,
                Body: binaryData,
            };

            const result = await s3.upload(uploadParams).promise();
            const objectUrl = result.Location;
            imageUrl = [...imageUrl, objectUrl]
        }

        let updatedOrder;
        if(payment.amount === payment.amount_paid){
            updatedOrder = await Order.findByIdAndUpdate(order_id, {
                $set: {status: 'PAYMENT COMEPLTE'}},
                {new: true});
        }else{
            updatedOrder = await Order.findByIdAndUpdate(order_id, {
                $set: {status: 'PAYMENT FAILED'}},
                {new: true});
        }

        return new ResponseData("success", 200, "Success", updatedOrder);
    }
}