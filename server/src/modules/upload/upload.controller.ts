import { NextFunction, Request, Response } from "express";
import { uploadToCloudinary } from "../../common/utils/upload.util.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { sendSuccess } from "../../common/utils/response.util.js";

export const UploadController = {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw createError("No image file provided", 400);
      }

      const imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "posts/content",
      );

      sendSuccess(res, "Image uploaded successfully", { url: imageUrl }, 201);
    } catch (error) {
      next(error);
    }
  },
};
