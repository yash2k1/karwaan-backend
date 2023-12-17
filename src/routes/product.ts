import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controller/product";

const router = Router();

router
    .route('/')
    .post(createProduct)
    .get(getAllProducts);

router
    .route('/:id')
    .get(getSingleProduct)
    .put(updateProduct)
    .delete(deleteProduct);

export default router;