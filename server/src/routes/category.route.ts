import express from "express";

import { isAuth } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../modules/category/category.schema.js";
import { validateParams } from "../middlewares/validateParams.middleware.js";
import { idParamSchema } from "../common/validators/param.validator.js";
import { CategoryController } from "../modules/category/category.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { verifyCsrfToken } from "../middlewares/csrf.middleware.js";

const router = express.Router();

router.use(isAuth);

router.get("/", CategoryController.getAllCategories);
router.get(
  "/:id",
  validateParams(idParamSchema),
  CategoryController.getCategoryById,
);
router.post(
  "/",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateRequest(createCategorySchema),
  CategoryController.createCategory,
);
router.patch(
  "/:id",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateParams(idParamSchema),
  validateRequest(updateCategorySchema),
  CategoryController.updateCategory,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateParams(idParamSchema),
  CategoryController.deleteCategory,
);

export default router;
