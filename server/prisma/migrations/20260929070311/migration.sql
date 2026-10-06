/*
  Warnings:

  - You are about to drop the column `barcode` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "products_barcode_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "barcode";
