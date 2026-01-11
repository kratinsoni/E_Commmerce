import { Router } from "express";   
import {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    refreshAccessToken,
    changePassword,
    getAllUser,
    updateAccount,
    getUserProfile,
    addProductToCart,
    removeProductFromCart,
    getCart,
    changeQuantityInCart
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js"; 

const router = Router();

router.use((req, res, next) => {
  console.log(`Incoming request to user route: ${req.method} ${req.url}`);
  next();
});

router.route("/registerAdmin").post(registerUser);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getUser);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/all-users").get(verifyJWT, adminMiddleware, getAllUser);
router.route("/update-account").put(verifyJWT, updateAccount); 
router.route("/profile/:name").get(verifyJWT, getUserProfile);//making it params 
router.route("/cart/add/:productId").post(verifyJWT, addProductToCart);
router.route("/cart/remove/:productId").delete(verifyJWT, removeProductFromCart); 
router.route("/cart/items").get(verifyJWT, getCart); 
router.route("/cart/change-quantity/:productId").patch(verifyJWT, changeQuantityInCart);

export default router;