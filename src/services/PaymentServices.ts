import axios from "axios";
import Logger from "../utils/Logger";
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({ 
    key_id: `${process.env.RAZOR_PAY_KEY_ID}`, 
    key_secret: `${process.env.RAZOR_PAY_SECRET_KEY}`,
});

export class PaymentServices {
    static async createOrder(amount: number, order_id: string) {
        try {
            const order = await razorpayInstance.orders.create({
                amount: amount,
                currency: 'INR',
                receipt: order_id,
                partial_payment: false,
                notes: {
                    key1: "Order generation for karwaan films.",
                    key2: null
                }
            });
            
            return order;
        } catch (error: any) {
            // Log the error description
            return Logger.error(error.description);
        }
    }
}
