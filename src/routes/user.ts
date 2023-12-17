import { Router } from "express";
import { deleteUser, forgotPassword, getUser, resetPassword, sendVerificationEmail, signin, signout, signup, updateUser, verifyEmail } from "../controller/user";

const router = Router();

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/signout').post(signout);
router.route('/send-verification-email').post(sendVerificationEmail);
router.route('/verify-email').post(verifyEmail);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').put(resetPassword);
router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

export default router;