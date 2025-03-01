/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "PandemicOversightBusiness" (
    "id" TEXT NOT NULL,
    "borrower" TEXT NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "amountForgiven" DOUBLE PRECISION NOT NULL,
    "loanStatus" TEXT NOT NULL,
    "dateApproved" TIMESTAMP(3) NOT NULL,
    "dateForgiven" TIMESTAMP(3) NOT NULL,
    "payroll" DOUBLE PRECISION NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL,
    "utilities" DOUBLE PRECISION NOT NULL,
    "healthCare" DOUBLE PRECISION NOT NULL,
    "mortageInterest" DOUBLE PRECISION NOT NULL,
    "debtInterest" DOUBLE PRECISION NOT NULL,
    "refinancingEIDL" DOUBLE PRECISION NOT NULL,
    "notProvided" DOUBLE PRECISION NOT NULL,
    "lenderName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "industryDetailed" TEXT NOT NULL,
    "ageOfBusiness" TEXT NOT NULL,
    "borrowerCity" TEXT NOT NULL,
    "borrowerState" TEXT NOT NULL,
    "borrowerZip" TEXT NOT NULL,
    "borrowerCounty" TEXT NOT NULL,
    "borrowerCongressionalDistrict" INTEGER NOT NULL,
    "jobsReported" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "race" TEXT NOT NULL,

    CONSTRAINT "PandemicOversightBusiness_pkey" PRIMARY KEY ("id")
);
