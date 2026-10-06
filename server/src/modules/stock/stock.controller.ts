import { NextFunction, Request, Response } from "express";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { StockService } from "./stock.service.js";
import { sendSuccess } from "../../common/utils/response.util.js";
import { stockMovementQuerySchema } from "./stock.schema.js";

export const StockController = {
  async getAllStockMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const query = stockMovementQuerySchema.parse(req.query);

      const { data, meta } = await StockService.findAllStockMovements(query);

      sendSuccess(res, "Success get all stock movements", data, 200, meta);
    } catch (error) {
      next(error);
    }
  },

  async getStockMovementById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const movement = await StockService.findStockMovementById(id);

      sendSuccess(res, "Success get stock movement by id", movement, 200);
    } catch (error) {
      next(error);
    }
  },

  async stockIn(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw createError("Unauthorized", 401);
      }

      const result = await StockService.stockIn(req.body, req.user.id);

      sendSuccess(res, "Success create stock in", result, 201);
    } catch (error) {
      next(error);
    }
  },
  async stockOut(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw createError("Unauthorized", 401);
      }

      const result = await StockService.stockOut(req.body, req.user.id);

      sendSuccess(res, "Success create stock out", result, 201);
    } catch (error) {
      next(error);
    }
  },
  async stockAdjustment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw createError("Unauthorized", 401);
      }

      const result = await StockService.stockAdjustment(req.body, req.user.id);

      sendSuccess(res, "Success create stock adjustment", result, 201);
    } catch (error) {
      next(error);
    }
  },
};
