-- CreateEnum
CREATE TYPE "ParentStatus" AS ENUM ('pending', 'verified', 'expired');

-- CreateTable
CREATE TABLE "parent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "ParentStatus" NOT NULL DEFAULT 'pending',
    "token" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSentAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parent_userId_key" ON "parent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parent_token_key" ON "parent"("token");

-- CreateIndex
CREATE INDEX "parent_status_idx" ON "parent"("status");

-- CreateIndex
CREATE INDEX "parent_email_idx" ON "parent"("email");

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
