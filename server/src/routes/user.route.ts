import express from "express";
import { UserController } from "../modules/user/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../modules/user/user.schema.js";
import { validateParams } from "../middlewares/validateParams.middleware.js";
import { idParamSchema } from "../common/validators/param.validator.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { verifyCsrfToken } from "../middlewares/csrf.middleware.js";

const router = express.Router();

router.use(isAuth, authorize("ADMIN"));

router.get("/", UserController.getAllUsers);
router.get("/:id", validateParams(idParamSchema), UserController.getUserById);
router.post(
  "/",
  verifyCsrfToken,
  validateRequest(createUserSchema),
  UserController.createUser,
);
router.patch(
  "/:id",
  verifyCsrfToken,
  validateParams(idParamSchema),
  validateRequest(updateUserSchema),
  UserController.updateUser,
);
router.delete(
  "/:id",
  verifyCsrfToken,
  validateParams(idParamSchema),
  UserController.deleteUser,
);

export default router;
