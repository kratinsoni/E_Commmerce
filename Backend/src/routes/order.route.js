import { Router } from "express";
import {
    createOrder,
    buyNow,
    getUserOrders,
    getAllUserOrders,
    getUserOrdersById,
    updateOrder } from "../controllers/order.controller.js";

import { adminMiddleware } from "../middlewares/admin.middleware.js";   
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`Incoming request to product route: ${req.method} ${req.url}`);
  next();
}); 

router.post( "/", verifyJWT, createOrder );
router.post( "/buy-now/:productId", verifyJWT, buyNow );
router.get( "/", verifyJWT, getUserOrders );
router.get( "/all", verifyJWT, adminMiddleware, getAllUserOrders );
router.get( "/user/:userId", verifyJWT, getUserOrdersById );
// router.patch( "/deliver/:orderId", verifyJWT, onDelivery );   
// router.patch( "/cancel/:orderId", verifyJWT, cancelOrder );
router.patch( "/update/:orderId", verifyJWT, updateOrder );

export default router;