import { Router } from "express";
import User from './user';
import Product from './product';
import Upload from './upload';
import CartItem from './cartItem';
import Order from './order';

const router = Router();

router.use('/api/v1/user', User);
router.use('/api/v1/product', Product);
router.use('/api/v1/upload', Upload);
router.use('/api/v1/cart-item', CartItem);
router.use('/api/v1/order', Order);

export default router;