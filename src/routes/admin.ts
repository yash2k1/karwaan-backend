import { Router } from "express";
import { addProduct, deleteProduct, updateProduct } from "../controller/admin";

const router = Router();

router.route('/create-product').post(addProduct);
router.route('/update-product/:id').put(updateProduct);
router.route('/delete-product/:id').delete(deleteProduct);

export default router;