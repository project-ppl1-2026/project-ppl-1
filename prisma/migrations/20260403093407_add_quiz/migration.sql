-- CreateEnum
CREATE TYPE "AgeSegment" AS ENUM ('ANAK', 'REMAJA', 'MAHASISWA', 'DEWASA_MUDA');

-- CreateTable
CREATE TABLE "quiz_question" (
    "id" TEXT NOT NULL,
    "ageSegment" "AgeSegment" NOT NULL,
    "category" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "correctOption" TEXT NOT NULL,
    "explanationCorrect" TEXT NOT NULL,
    "explanationIncorrect" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "chosenOption" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quiz_question_ageSegment_idx" ON "quiz_question"("ageSegment");

-- CreateIndex
CREATE INDEX "quiz_log_userId_idx" ON "quiz_log"("userId");

-- CreateIndex
CREATE INDEX "quiz_log_questionId_idx" ON "quiz_log"("questionId");

-- AddForeignKey
ALTER TABLE "quiz_log" ADD CONSTRAINT "quiz_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_log" ADD CONSTRAINT "quiz_log_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
