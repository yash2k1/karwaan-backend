import axios from "axios"

export class PaymentServices {
    static async createOrder (amount: number, order_id: string) {
        try {
            const options = {
                method: 'POST',
                url: 'https://api.razorpay.com/v1/orders',
                headers: {
                    accept: 'application/json',
                    'content/type': 'application/json',
                    'x-key-id': process.env.RAZOR_PAY_KEY_ID,
                    'x-key-secret': process.env.RAZOR_PAY_SECRET_KEY
                },
                data: {
                    amount: amount,
                    currency: 'INR',
                    receipt: order_id,
                    partial_payment: false
                }
            } 

            const res = await axios(options);
            return res?.data;
        } catch (error) {
            throw error
        }        
    }
}