import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { WarehouseController } from "../modules/warehouse/warehouse.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { verifyCsrfToken } from "../middlewares/csrf.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createWarehouseSchema,
  updateWarehouseSchema,
} from "../modules/warehouse/warehouse.schema.js";
import { validateParams } from "../middlewares/validateParams.middleware.js";
import { idParamSchema } from "../common/validators/param.validator.js";

const router = express.Router();

router.use(isAuth);

router.get("/", WarehouseController.getAllWarehouses);
router.get(
  "/:id",
  validateParams(idParamSchema),
  WarehouseController.getWarehouseById,
);
router.post(
  "/",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateRequest(createWarehouseSchema),
  WarehouseController.createWarehouse,
);
router.patch(
  "/:id",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateParams(idParamSchema),
  validateRequest(updateWarehouseSchema),
  WarehouseController.updateWarehouse,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  verifyCsrfToken,
  validateParams(idParamSchema),
  WarehouseController.deleteWarehouse,
);

export default router;
