import mongoose, { Schema } from "mongoose";

interface CartItemInterface {
    productId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

const CartItemSchema = new mongoose.Schema({
    productId: {type: String, required: true},
    userId: {type: String, required: true}
}, {timestamps: true});

const CartItem = mongoose.model<CartItemInterface>('CartItem', CartItemSchema);

export default CartItem;