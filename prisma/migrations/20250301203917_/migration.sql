/*
  Warnings:

  - A unique constraint covering the columns `[borrower,loanAmount,dateApproved,lenderName]` on the table `PandemicOversightBusiness` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PandemicOversightBusiness_borrower_loanAmount_dateApproved__key" ON "PandemicOversightBusiness"("borrower", "loanAmount", "dateApproved", "lenderName");
