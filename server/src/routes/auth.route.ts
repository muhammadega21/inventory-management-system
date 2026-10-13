import express from "express";

import { AuthController } from "../modules/auth/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { verifyCsrfToken } from "../middlewares/csrf.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { loginSchema } from "../modules/auth/auth.schema.js";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), AuthController.login);
router.get("/csrf", AuthController.csrfToken);
router.get("/me", isAuth, AuthController.me);
router.post("/refresh", verifyCsrfToken, AuthController.refreshToken);
router.post("/logout", verifyCsrfToken, AuthController.logout);

export default router;
