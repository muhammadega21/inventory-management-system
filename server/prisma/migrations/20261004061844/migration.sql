/*
  Warnings:

  - You are about to drop the column `bin_location` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `minimum_stock` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "inventories_warehouse_id_minimum_stock_idx";

-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "bin_location",
DROP COLUMN "minimum_stock";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "unit_price";

-- CreateIndex
CREATE INDEX "inventories_warehouse_id_idx" ON "inventories"("warehouse_id");
