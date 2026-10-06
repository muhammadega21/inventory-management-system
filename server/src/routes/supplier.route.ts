import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { SupplierController } from "../modules/supplier/supplier.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validateParams } from "../middlewares/validateParams.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "../modules/supplier/supplier.schema.js";
import { verifyCsrfToken } from "../middlewares/csrf.middleware.js";
import { idParamSchema } from "../common/validators/param.validator.js";

const router = express.Router();

router.use(isAuth);

router.get("/", SupplierController.getAllSuppliers);
router.get(
  "/:id",
  validateParams(idParamSchema),
  SupplierController.getSupplierById,
);
router.post(
  "/",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateRequest(createSupplierSchema),
  SupplierController.createSupplier,
);
router.patch(
  "/:id",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateParams(idParamSchema),
  validateRequest(updateSupplierSchema),
  SupplierController.updateSupplier,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateParams(idParamSchema),
  SupplierController.deleteSupplier,
);

export default router;
