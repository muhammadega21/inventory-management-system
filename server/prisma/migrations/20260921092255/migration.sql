/*
  Warnings:

  - You are about to drop the column `created_at` on the `stock_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `stock_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `warehouses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barcode]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `warehouses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `warehouses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WarehouseType" AS ENUM ('HUB', 'TRANSIT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('DRAFT', 'POSTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "bin_location" TEXT,
ADD COLUMN     "minimum_stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "unit_price" DECIMAL(15,2) NOT NULL DEFAULT 0,
ALTER COLUMN "minimum_stock" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "stock_transaction_items" ADD COLUMN     "physical_quantity" INTEGER,
ADD COLUMN     "unit_price" DECIMAL(15,2);

-- AlterTable
ALTER TABLE "stock_transactions" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "counterparty_name" TEXT,
ADD COLUMN     "reference_number" TEXT,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "warehouses" DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "capacity" DECIMAL(12,2),
ADD COLUMN     "capacity_unit" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "type" "WarehouseType" NOT NULL DEFAULT 'HUB';

-- CreateTable
CREATE TABLE "user_warehouses" (
    "user_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER NOT NULL,

    CONSTRAINT "user_warehouses_pkey" PRIMARY KEY ("user_id","warehouse_id")
);

-- CreateIndex
CREATE INDEX "user_warehouses_warehouse_id_idx" ON "user_warehouses"("warehouse_id");

-- CreateIndex
CREATE INDEX "inventories_warehouse_id_minimum_stock_idx" ON "inventories"("warehouse_id", "minimum_stock");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");

-- CreateIndex
CREATE INDEX "suppliers_city_idx" ON "suppliers"("city");

-- CreateIndex
CREATE INDEX "warehouses_type_idx" ON "warehouses"("type");

-- CreateIndex
CREATE INDEX "warehouses_city_idx" ON "warehouses"("city");

-- AddForeignKey
ALTER TABLE "user_warehouses" ADD CONSTRAINT "user_warehouses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_warehouses" ADD CONSTRAINT "user_warehouses_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
