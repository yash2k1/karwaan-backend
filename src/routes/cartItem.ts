import { Router } from "express";
import { addItemToCart, emptyCart, getAllCartItems, removeItemFromCart } from "../controller/cartItem";

const router = Router();

router.route('/').post(addItemToCart)

// here, this is cartItemId 
router.route('/:id').delete(removeItemFromCart)

// here, this id is userId 
router
    .route('/:id')
    .get(getAllCartItems)
    .delete(emptyCart);

export default router;