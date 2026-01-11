import { Router } from "express";
import {
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  updateProductImage,
} from "../controllers/product.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`Incoming request to product route: ${req.method} ${req.url}`);
  next();
});

router
  .route("/")
  .post(verifyJWT, adminMiddleware, upload.single("productImage"), addProduct);
router.get("/:productId", getProductById);
router.patch(
  "/:productId",
  verifyJWT,
  adminMiddleware,
  upload.single("productImage"),
  updateProduct
);

router.delete("/:productId", verifyJWT, adminMiddleware, deleteProduct);
router.get("/", verifyJWT, getAllProducts);
router.patch(
  "/productImageUpdate/:productId",
  verifyJWT,
  adminMiddleware,
  upload.single("productImage"),
  updateProductImage
);

export default router;
