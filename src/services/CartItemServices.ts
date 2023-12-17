import { pipeline } from "nodemailer/lib/xoauth2";
import CartItem from "../model/cartItem";
import Product from "../model/product";
import User from "../model/user";
import { ResponseData } from "../utils/ResponseData";

type AddItemToCartPayload = {
    productId: string;
    userId: string;
}

type RemoveItemFromCartPayload = {
    userId: string;
    id: string;
}

export class CartItemServices {
    static async addItemToCart (payload: AddItemToCartPayload) {
        let data;

        const {productId, userId} = payload;

        const product = await Product.findById(productId);
        if(!product){
            data = new ResponseData("error", 400, "Product not found", null);

            return data;
        }

        const user = await User.findById(userId);
        if(!user){
            data = new ResponseData("error", 400, "Product not found", null);

            return data;
        }

        const cartItem = await CartItem.findOne({userId: userId, productId: productId});

        if(cartItem){
            data = new ResponseData("success", 200, "Item is already in cart", cartItem);

            return data;
        }

        const newCartItem = await CartItem.create({
            userId: userId,
            productId: productId
        });

        data = new ResponseData("success", 200, "Item added to cart", newCartItem);

        return data;
    } 

    static async removeItemFromCart (payload: RemoveItemFromCartPayload) {
        let data;
        const {userId, id} = payload
        const user = await User.findById(userId);
        if(!user){
            data = new ResponseData("error", 400, "User not found", null); 

            return data;
        }

        
        const cartItem = await CartItem.findById(id);
        
        if(!cartItem){ 
            data = new ResponseData("error", 400, "Cart Item not found", null)

            return data; 
        }

        console.log(cartItem.userId);
        if(userId !== cartItem.userId){
            data = new ResponseData("error", 400, "You cannot remove item from some one else's cart", null);

            return data;
        }


        await cartItem.deleteOne();
        await cartItem.save();

        data =  new ResponseData("success", 200, "Item removed from cart", null);

        return data;
    }

    static async getAllCartItems (payload: string) {
        let data;

        const user = await User.findById(payload);

        if(!user){
            data = new ResponseData("error", 400, "User not found", null);

            return data;
        }

        const cartItems = await CartItem.aggregate([
            { $match: { userId: payload } },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "userId",
                    as: "user",
                },
            },
            {$unwind: "$user"},
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "productId",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 1,
                    user_details: {
                        firstName: "$user.firstName",
                        lastName: "$user.lastName",
                        email: "$user.email",
                        phoneNumber: "$user.phoneNumber",
                    },
                    product_details: {
                        name: "$product.name",
                        price: "$product.price",
                        description: "$product.description",
                        linkToMedia: "$product.linkToMedia",
                    },
                },
            },
        ]);
          
        if(cartItems.length === 0){
            data = new ResponseData("success", 200, "There are no items in your cart", cartItems);

            return data;
        }

        data = new ResponseData("success", 200, "Success", cartItems);

        return data;
    }

    static async emptyCart(payload: string){
        let data;

        const user = await User.findById(payload);
        if(!user){
            data = new ResponseData("error", 400, "User not found", null);

            return data;
        }

        const cartItems = await CartItem.find({userId: payload});
        if(cartItems.length === 0){
            data = new ResponseData("success", 200, "Your cart is already empty", null);

            return data;
        }

        cartItems.map(async (cartItem) => {
            await cartItem.deleteOne();
            await cartItem.save();
        });

        data = new ResponseData("success", 200, "You cart is now empty", null);
        return data;
    }
}