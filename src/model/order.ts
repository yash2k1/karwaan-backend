import mongoose, { Schema } from "mongoose";

interface OrderInterface {
    productId: string;
    userId: string;
    status: 'PAYMENT PENDING' | 'PAYMENT COMEPLTE',
    download_url: string | null;
};

const OrderSchema = new mongoose.Schema({
    productId: {type: String, required: true},
    userId: {type: String, required: true},
    status: {type: String, default: 'PAYMENT PENDING', required: true},
    download_url: {type: String, default: null}
});

const Order = mongoose.model<OrderInterface>('Order', OrderSchema);

export default Order;