import { NextFunction, Request, Response } from "express";
import { getCommonQuery } from "../../common/utils/helper.js";
import { UserService } from "./user.service.js";
import { sendSuccess } from "../../common/utils/response.util.js";

export const UserController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getCommonQuery(req);
      const { data, meta } = await UserService.findAllUsers(query);

      sendSuccess(res, "Success get all users", data, 200, meta);
    } catch (error) {
      next(error);
    }
  },
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await UserService.findUserById(id);

      sendSuccess(res, "Success get user by id", user, 200);
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      sendSuccess(res, "Success create user", user, 201);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await UserService.updateUser(id, req.body);
      sendSuccess(res, "Success update user", user, 200);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await UserService.deleteUser(id);
      sendSuccess(res, "Success delete user");
    } catch (error) {
      next(error);
    }
  },
};
