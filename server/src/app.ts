import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { sendError } from "./common/utils/response.util.js";
import "dotenv/config";

const app = express();

app.use((helmet as any)());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404);
});

app.use(errorHandler);

export default app;
