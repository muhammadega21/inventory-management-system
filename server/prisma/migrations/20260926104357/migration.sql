/*
  Warnings:

  - You are about to drop the column `capacity` on the `warehouses` table. All the data in the column will be lost.
  - You are about to drop the column `capacity_unit` on the `warehouses` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `warehouses` table. All the data in the column will be lost.
  - You are about to drop the `user_warehouses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_warehouses" DROP CONSTRAINT "user_warehouses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_warehouses" DROP CONSTRAINT "user_warehouses_warehouse_id_fkey";

-- DropIndex
DROP INDEX "warehouses_type_idx";

-- AlterTable
ALTER TABLE "suppliers" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "warehouses" DROP COLUMN "capacity",
DROP COLUMN "capacity_unit",
DROP COLUMN "type";

-- DropTable
DROP TABLE "user_warehouses";

-- DropEnum
DROP TYPE "WarehouseType";
