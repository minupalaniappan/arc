-- AlterTable
ALTER TABLE "BizBuySellProduct" ADD COLUMN     "rawFinancials" TEXT,
ADD COLUMN     "rawListingDetails" TEXT;

-- CreateTable
CREATE TABLE "AxleBusiness" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "executiveName" TEXT,
    "streetAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "phone" TEXT,
    "axelBusinessUrl" TEXT,

    CONSTRAINT "AxleBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AxleBusiness_axelBusinessUrl_key" ON "AxleBusiness"("axelBusinessUrl");
