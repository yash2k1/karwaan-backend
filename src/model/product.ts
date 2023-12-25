import mongoose, { Schema, Types } from "mongoose";

export interface ProductInterface {
    userId: string;
    name: string;
    tags: string[];
    description: string;
    price: number;
    media: {
        data: string,
        url: string | null
        type: 'image' | 'video'
    },
    paid: boolean;
    createdAt: string;
    updatedAt: string;
}

const ProductSchema = new mongoose.Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String, required: true},
    tags: {type: Array, default: []},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    media: {
        data: {type: String, required: true},
        url: {type: String, default: null},
        type: {type: String, required: true}
    },
    paid: {type: Boolean, default: true},
}, {timestamps: true});

const Product = mongoose.model<ProductInterface>('Product', ProductSchema);

export default Product;