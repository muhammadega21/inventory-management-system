import { NextFunction, Request, Response } from "express";
import { getCommonQuery } from "../../common/utils/helper.js";
import { ProductService } from "./product.service.js";
import { sendSuccess } from "../../common/utils/response.util.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../common/utils/upload.util.js";

export const ProductController = {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getCommonQuery(req);
      const { data, meta } = await ProductService.findAllProducts(query);

      sendSuccess(res, "Success get all products", data, 200, meta);
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const product = await ProductService.findProductById(id);

      sendSuccess(res, "Success get product by id", product, 200);
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req: Request, res: Response, next: NextFunction) {
    let uploadedImageUrl: string | undefined;
    try {
      const data = req.body;

      if (req.file) {
        uploadedImageUrl = await uploadToCloudinary(req.file.buffer, "product");

        data.image = uploadedImageUrl;
      }
      const product = await ProductService.createProduct(data);

      sendSuccess(res, "Success create product", product, 201);
    } catch (error) {
      if (uploadedImageUrl) {
        await deleteFromCloudinary(uploadedImageUrl);
      }
      next(error);
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    let uploadedImageUrl: string | undefined;
    try {
      const id = Number(req.params.id);
      const data = req.body;

      if (req.file) {
        uploadedImageUrl = await uploadToCloudinary(req.file.buffer, "product");

        data.image = uploadedImageUrl;
      }

      const product = await ProductService.updateProduct(id, data);

      sendSuccess(res, "Success update product", product, 200);
    } catch (error) {
      if (uploadedImageUrl) {
        await deleteFromCloudinary(uploadedImageUrl);
      }
      next(error);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await ProductService.deleteProduct(id);

      sendSuccess(res, "Success delete product", null, 200);
    } catch (error) {
      next(error);
    }
  },

  async getProductSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await ProductService.getProductSummary();

      return sendSuccess(res, "Success get product summary", summary, 200);
    } catch (error) {
      return next(error);
    }
  },
};
