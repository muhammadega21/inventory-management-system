import multer from "multer";
import { createError } from "./errorHandler.middleware.js";

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Max 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(createError("Only images are allowed", 400));
    }
  },
});
