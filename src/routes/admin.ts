import { Router } from "express";
import { addProduct, deleteProduct, getAllCustomer, getSingleCustomer, updateProduct } from "../controller/admin";

const router = Router();

router.route('/create-product').post(addProduct);
router.route('/update-product/:id').put(updateProduct);
router.route('/delete-product/:id').delete(deleteProduct);
router.route('/customer_details').get(getAllCustomer);
router.route('/customer_detail/:id').get(getSingleCustomer);
router.route('/revenue-generated').get(getSingleCustomer);

export default router;