import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { verifyCsrfToken } from "../middlewares/csrf.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";
import { UploadController } from "../modules/upload/upload.controller.js";

const router = express.Router();

router.post(
  "/image",
  isAuth,
  authorize("ADMIN"),
  verifyCsrfToken,
  uploadImage.single("image"),
  UploadController.uploadImage,
);

export default router;
