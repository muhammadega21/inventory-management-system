-- AlterTable
ALTER TABLE "stock_transaction_items" ADD COLUMN     "physical_quantity" INTEGER,
ADD COLUMN     "unit_price" DECIMAL(15,2);
