import express from "express";
import { ProductController } from "../modules/product/product.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateParams } from "../middlewares/validateParams.middleware.js";
import { idParamSchema } from "../common/validators/param.validator.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { verifyCsrfToken } from "../middlewares/csrf.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../modules/product/product.schema.js";

const router = express.Router();

router.use(isAuth);

router.get("/", ProductController.getAllProducts);
router.get(
  "/:id",
  validateParams(idParamSchema),
  ProductController.getProductById,
);
router.post(
  "/",
  authorize("ADMIN"),
  verifyCsrfToken,
  uploadImage.single("image"),
  validateRequest(createProductSchema),
  ProductController.createProduct,
);
router.patch(
  "/:id",
  authorize("ADMIN"),
  verifyCsrfToken,
  uploadImage.single("image"),
  validateParams(idParamSchema),
  validateRequest(updateProductSchema),
  ProductController.updateProduct,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateParams(idParamSchema),
  ProductController.deleteProduct,
);

export default router;
