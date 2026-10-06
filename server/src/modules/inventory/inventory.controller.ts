import { NextFunction, Request, Response } from "express";
import { getCommonQuery } from "../../common/utils/helper.js";
import { InventoriyService } from "./inventory.service.js";
import { sendSuccess } from "../../common/utils/response.util.js";

export const InventoryController = {
  async getAllInventories(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getCommonQuery(req);
      const { data, meta } = await InventoriyService.findAllInventories(query);

      sendSuccess(res, "Success get all inventories", data, 200, meta);
    } catch (error) {
      next(error);
    }
  },
  async getInventoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const inventory = await InventoriyService.findInventoryById(id);

      sendSuccess(res, "Success get inventory by id", inventory, 200);
    } catch (error) {
      next(error);
    }
  },
};
