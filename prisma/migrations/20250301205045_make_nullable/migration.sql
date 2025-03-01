-- AlterTable
ALTER TABLE "PandemicOversightBusiness" ALTER COLUMN "loanAmount" DROP NOT NULL,
ALTER COLUMN "amountForgiven" DROP NOT NULL,
ALTER COLUMN "loanStatus" DROP NOT NULL,
ALTER COLUMN "dateApproved" DROP NOT NULL,
ALTER COLUMN "dateForgiven" DROP NOT NULL,
ALTER COLUMN "payroll" DROP NOT NULL,
ALTER COLUMN "rent" DROP NOT NULL,
ALTER COLUMN "utilities" DROP NOT NULL,
ALTER COLUMN "healthCare" DROP NOT NULL,
ALTER COLUMN "mortageInterest" DROP NOT NULL,
ALTER COLUMN "debtInterest" DROP NOT NULL,
ALTER COLUMN "refinancingEIDL" DROP NOT NULL,
ALTER COLUMN "notProvided" DROP NOT NULL,
ALTER COLUMN "lenderName" DROP NOT NULL,
ALTER COLUMN "businessType" DROP NOT NULL,
ALTER COLUMN "industry" DROP NOT NULL,
ALTER COLUMN "industryDetailed" DROP NOT NULL,
ALTER COLUMN "ageOfBusiness" DROP NOT NULL,
ALTER COLUMN "borrowerCity" DROP NOT NULL,
ALTER COLUMN "borrowerState" DROP NOT NULL,
ALTER COLUMN "borrowerZip" DROP NOT NULL,
ALTER COLUMN "borrowerCounty" DROP NOT NULL,
ALTER COLUMN "borrowerCongressionalDistrict" DROP NOT NULL,
ALTER COLUMN "jobsReported" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "race" DROP NOT NULL;
