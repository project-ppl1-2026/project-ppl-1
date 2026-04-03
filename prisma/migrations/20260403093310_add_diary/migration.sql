-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('USER', 'AI');

-- CreateTable
CREATE TABLE "diary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diary_message" (
    "id" TEXT NOT NULL,
    "diaryId" TEXT NOT NULL,
    "senderType" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diary_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "diary_userId_idx" ON "diary"("userId");

-- CreateIndex
CREATE INDEX "diary_message_diaryId_idx" ON "diary_message"("diaryId");

-- AddForeignKey
ALTER TABLE "diary" ADD CONSTRAINT "diary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diary_message" ADD CONSTRAINT "diary_message_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "diary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
