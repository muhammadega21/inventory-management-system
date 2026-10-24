import { NextFunction, Request, Response } from "express";
import { getCommonQuery } from "../../common/utils/helper.js";
import { CategoryService } from "./category.service.js";
import { sendSuccess } from "../../common/utils/response.util.js";

export const CategoryController = {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getCommonQuery(req);
      const { data, meta } = await CategoryService.findAllCategories(query);

      sendSuccess(res, "Success get all categories", data, 200, meta);
    } catch (error) {
      next(error);
    }
  },
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const category = await CategoryService.findCategoryById(id);

      sendSuccess(res, "Success get category by id", category, 200);
    } catch (error) {
      next(error);
    }
  },
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await CategoryService.createCategory(req.body);
      sendSuccess(res, "Success create category", user, 201);
    } catch (error) {
      next(error);
    }
  },
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await CategoryService.updateCategory(id, req.body);
      sendSuccess(res, "Success update category", user, 200);
    } catch (error) {
      next(error);
    }
  },
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await CategoryService.deleteCategory(id);
      sendSuccess(res, "Success deactivate category");
    } catch (error) {
      next(error);
    }
  },
};
