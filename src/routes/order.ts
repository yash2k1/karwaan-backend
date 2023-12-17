import { Router } from "express";
import { createOrder } from "../controller/order";

const router = Router();

router.route('/').post(createOrder);

export default router;