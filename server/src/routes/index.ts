import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import supplierRoutes from "./supplier.route.js";
import warehouseRoutes from "./warehouse.route.js";
import categoryRoutes from "./category.route.js";
import productRoutes from "./product.route.js";
import uploadRouter from "./upload.route.js";
import inventoryRoutes from "./inventory.route.js";
import stockRoutes from "./stock.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/upload", uploadRouter);
router.use("/inventory", inventoryRoutes);
router.use("/stock", stockRoutes);

export default router;
