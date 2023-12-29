import mongoose, { Schema } from "mongoose";

interface OrderInterface {
    products: string[];
    userId: string;
    status: 'PAYMENT PENDING' | 'PAYMENT COMPELTE' | 'PAYMENT FAILED',
    amount: number;
    payment_id: string;
    download_url: string[];
};

const OrderSchema = new mongoose.Schema({
    products: [{type: Schema.Types.ObjectId, ref: "Product", required: true}],
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    status: {type: String, default: 'PAYMENT PENDING', required: true},
    payment_id: {type: String, default: null},
    amount: {type: Number, required: true},
    download_url: {type: Array, default: []},
});

const Order = mongoose.model<OrderInterface>('Order', OrderSchema);

export default Order;