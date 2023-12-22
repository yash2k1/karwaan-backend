import mongoose, { Schema } from "mongoose";

interface CartItemInterface {
    productId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

const CartItemSchema = new mongoose.Schema({
    productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true});

const CartItem = mongoose.model<CartItemInterface>('CartItem', CartItemSchema);

export default CartItem;