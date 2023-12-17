import { Router } from "express";
import { uploadMedia } from "../controller/upload";

const router = Router();

router.route('/').post(uploadMedia);

export default router;