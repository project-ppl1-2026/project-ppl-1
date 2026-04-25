-- DropIndex
DROP INDEX IF EXISTS "subscription_userId_key";

-- AlterTable
ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "durationMonths" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "snapToken" TEXT;
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'pending';
ALTER TABLE "payment" ALTER COLUMN "paymentType" DROP NOT NULL;

-- Set orderId for existing rows (if any)
UPDATE "payment" SET "orderId" = id WHERE "orderId" IS NULL;

-- Make orderId NOT NULL
ALTER TABLE "payment" ALTER COLUMN "orderId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "payment_orderId_key" ON "payment"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "payment_orderId_idx" ON "payment"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "subscription_userId_idx" ON "subscription"("userId");
