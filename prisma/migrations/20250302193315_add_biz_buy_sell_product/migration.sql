-- CreateTable
CREATE TABLE "BizBuySellProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "logo" TEXT,
    "image" TEXT,
    "description" TEXT,
    "url" TEXT,
    "productId" TEXT NOT NULL,
    "offerPrice" DOUBLE PRECISION,
    "priceCurrency" TEXT,
    "availability" BOOLEAN,
    "addressLocality" TEXT,
    "addressRegion" TEXT,

    CONSTRAINT "BizBuySellProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BizBuySellProduct_productId_key" ON "BizBuySellProduct"("productId");
