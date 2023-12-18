import { Router } from "express";
import { getAllProducts, getSingleProduct, searchProducts } from "../controller/product";

const router = Router();

router.route('/').get(getAllProducts);
router.route('/search').get(searchProducts);
router.route('/:id').get(getSingleProduct);

export default router;