import express from "express";

import { isAuth } from "../middlewares/auth.middleware.js";
import { verifyCsrfToken } from "../middlewares/csrf.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";

import { StockController } from "../modules/stock/stock.controller.js";

import {
  stockAdjustmentSchema,
  stockInSchema,
  stockOutSchema,
} from "../modules/stock/stock.schema.js";

const router = express.Router();

router.use(isAuth);

router.get("/movements", StockController.getAllStockMovements);

router.get("/movements/:id", StockController.getStockMovementById);

router.post(
  "/in",
  verifyCsrfToken,
  validateRequest(stockInSchema),
  StockController.stockIn,
);

router.post(
  "/out",
  verifyCsrfToken,
  validateRequest(stockOutSchema),
  StockController.stockOut,
);

router.post(
  "/adjustment",
  verifyCsrfToken,
  validateRequest(stockAdjustmentSchema),
  StockController.stockAdjustment,
);

export default router;
