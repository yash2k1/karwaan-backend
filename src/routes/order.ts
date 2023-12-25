import { Router } from "express";
import { createOrder, updateOrderPaymentStatus } from "../controller/order";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.route('/').post(verifyToken, createOrder);
router.route('/:id').put(verifyToken, updateOrderPaymentStatus);

export default router;