import { Router } from "express";
import User from './user';
import Product from './product';
import Upload from './upload';
import CartItem from './cartItem';
import Order from './order';
import Admin from './admin';
import Test from './test';

const router = Router();

router.use('/api/v1/user', User);
router.use('/api/v1/product', Product);
router.use('/api/v1/upload', Upload);
router.use('/api/v1/cart-item', CartItem);
router.use('/api/v1/order', Order);
router.use('/api/v1/admin', Admin);
{/*
*
*
*
Please make sure to be cautious while using test endpoint. The endpoints are not for production and are purely for development purposes.
*
*
*
*/}
router.use('/api/v1/test', Test);

export default router;