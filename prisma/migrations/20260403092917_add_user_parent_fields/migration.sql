-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('free_summary', 'premium_pdf');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('sent', 'failed');

-- AlterTable
ALTER TABLE "parent" ADD COLUMN     "lastReportStatus" "ReportStatus",
ADD COLUMN     "lastReportType" "ReportType";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Aktif';
