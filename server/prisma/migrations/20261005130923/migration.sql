/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `stock_movements` table. All the data in the column will be lost.
  - You are about to drop the column `physical_quantity` on the `stock_transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `stock_transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `counterparty_name` on the `stock_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `reference_number` on the `stock_transactions` table. All the data in the column will be lost.
  - Added the required column `stock_transaction_id` to the `stock_movements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_transaction_id_fkey";

-- DropIndex
DROP INDEX "stock_movements_transaction_id_idx";

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "transaction_id",
ADD COLUMN     "stock_transaction_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stock_transaction_items" DROP COLUMN "physical_quantity",
DROP COLUMN "unit_price";

-- AlterTable
ALTER TABLE "stock_transactions" DROP COLUMN "counterparty_name",
DROP COLUMN "reference_number";

-- CreateIndex
CREATE INDEX "stock_movements_stock_transaction_id_idx" ON "stock_movements"("stock_transaction_id");

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_stock_transaction_id_fkey" FOREIGN KEY ("stock_transaction_id") REFERENCES "stock_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
