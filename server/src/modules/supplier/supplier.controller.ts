import { NextFunction, Request, Response } from "express";
import { getCommonQuery } from "../../common/utils/helper.js";
import { SupplierService } from "./supplier.service.js";
import { sendSuccess } from "../../common/utils/response.util.js";

export const SupplierController = {
  async getAllSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getCommonQuery(req);
      const { data, meta } = await SupplierService.findAllSuppliers(query);

      sendSuccess(res, "Success get all suppliers", data, 200, meta);
    } catch (error) {
      next(error);
    }
  },
  async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const supplier = await SupplierService.findSupplierById(id);

      sendSuccess(res, "Success get supplier by id", supplier, 200);
    } catch (error) {
      next(error);
    }
  },
  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await SupplierService.createSupplier(req.body);

      sendSuccess(res, "Success create supplier", supplier, 201);
    } catch (error) {
      next(error);
    }
  },
  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const supplier = await SupplierService.updateSupplier(id, req.body);

      sendSuccess(res, "Success update supplier", supplier, 200);
    } catch (error) {
      next(error);
    }
  },
  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await SupplierService.deleteSupplier(id);
      sendSuccess(res, "Success delete supplier");
    } catch (error) {
      next(error);
    }
  },
};
