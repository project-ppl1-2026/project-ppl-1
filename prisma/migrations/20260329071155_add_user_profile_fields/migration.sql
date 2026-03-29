-- AlterTable
ALTER TABLE "user" ADD COLUMN     "birthYear" INTEGER,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "parentEmail" TEXT,
ADD COLUMN     "profileFilled" BOOLEAN NOT NULL DEFAULT false;
