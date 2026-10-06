import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { InventoryController } from "../modules/inventory/inventory.controller.js";
import { validateParams } from "../middlewares/validateParams.middleware.js";
import { idParamSchema } from "../common/validators/param.validator.js";

const router = express.Router();

router.use(isAuth);

router.get("/", InventoryController.getAllInventories);
router.get(
  "/:id",
  validateParams(idParamSchema),
  InventoryController.getInventoryById,
);

export default router;
