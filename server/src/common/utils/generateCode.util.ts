import { StockType } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import crypto from "node:crypto";

export const generateSupplierCode = async (): Promise<string> => {
  const lastSupplier = await prisma.supplier.findFirst({
    orderBy: {
      id: "desc",
    },
    select: {
      code: true,
    },
  });

  if (!lastSupplier) {
    return "VND-00001";
  }

  const lastNumber = Number(lastSupplier.code.replace("VND-", ""));
  const nextNumber = lastNumber + 1;

  return `VND-${String(nextNumber).padStart(5, "0")}`;
};

export const generateWarehouseCode = async (): Promise<string> => {
  const lastWarehouse = await prisma.warehouse.findFirst({
    orderBy: {
      id: "desc",
    },
    select: {
      code: true,
    },
  });

  if (!lastWarehouse) {
    return "WH-00001";
  }

  const lastNumber = Number(lastWarehouse.code.replace("WH-", ""));
  const nextNumber = lastNumber + 1;

  return `WH-${String(nextNumber).padStart(5, "0")}`;
};

export const generateProductSku = async (): Promise<string> => {
  const lastProduct = await prisma.product.findFirst({
    orderBy: {
      id: "desc",
    },
    select: {
      sku: true,
    },
  });

  if (!lastProduct) {
    return "PROD-00001";
  }

  const lastNumber = Number(lastProduct.sku.replace("PROD-", ""));
  const nextNumber = lastNumber + 1;

  return `PROD-${String(nextNumber).padStart(5, "0")}`;
};

export const generateTransactionNumber = (type: StockType) => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const random = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `STK-${type}-${year}${month}${day}-${random}`;
};
