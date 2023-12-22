import mongoose, { Schema } from "mongoose";

export interface ProductInterface {
    userId: string;
    name: string;
    tags: string[];
    description: string;
    price: number;
    linkToMedia: string;
    size: '8"x12"' | '12"x18"' | '16"x24"' | '20"x30"' | '24"x36"';
    isFreeToUse: boolean;
    createdAt: string;
    updatedAt: string;
}

const ProductSchema = new mongoose.Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String, required: true},
    tags: {type: Array, default: []},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    linkToMedia: {type: String, required: true},
    size: {type: String, default: '8"x12"'},
    isFreeToUse: {type: Boolean, default: false},
}, {timestamps: true});

const Product = mongoose.model<ProductInterface>('Product', ProductSchema);

export default Product;