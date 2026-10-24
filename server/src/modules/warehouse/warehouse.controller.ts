import { NextFunction, Request, Response } from "express";
import { getCommonQuery } from "../../common/utils/helper.js";
import { WarehouseService } from "./warehouse.service.js";
import { sendSuccess } from "../../common/utils/response.util.js";

export const WarehouseController = {
  async getAllWarehouses(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getCommonQuery(req);
      const { data, meta } = await WarehouseService.findAllWarehouses(query);
      sendSuccess(res, "Success get all warehouses", data, 200, meta);
    } catch (error) {
      next(error);
    }
  },
  async getWarehouseById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const warehouse = await WarehouseService.findWarehouseById(id);

      sendSuccess(res, "Success get warehouse by id", warehouse, 200);
    } catch (error) {
      next(error);
    }
  },
  async getWarehouseSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await WarehouseService.getWarehouseSummary();
      sendSuccess(res, "Success get warehouse summary", summary, 200);
    } catch (error) {
      next(error);
    }
  },
  async createWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouse = await WarehouseService.createWarehouse(req.body);

      sendSuccess(res, "Success create warehouse", warehouse, 201);
    } catch (error) {
      next(error);
    }
  },
  async updateWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const warehouse = await WarehouseService.updateWarehouse(id, req.body);

      sendSuccess(res, "Success update warehouse", warehouse, 200);
    } catch (error) {
      next(error);
    }
  },
  async deleteWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await WarehouseService.deleteWarehouse(id);
      sendSuccess(res, "Success deactivate warehouse");
    } catch (error) {
      next(error);
    }
  },
};
