-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('TINGGI', 'SEDANG', 'RENDAH');

-- CreateTable
CREATE TABLE "insight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "averageScore" DECIMAL(65,30) NOT NULL,
    "analysisText" TEXT NOT NULL,
    "cognitivePattern" TEXT,
    "affirmation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_recommendation" (
    "id" TEXT NOT NULL,
    "insightId" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "actionText" TEXT NOT NULL,

    CONSTRAINT "insight_recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "insight_userId_idx" ON "insight"("userId");

-- CreateIndex
CREATE INDEX "insight_recommendation_insightId_idx" ON "insight_recommendation"("insightId");

-- AddForeignKey
ALTER TABLE "insight" ADD CONSTRAINT "insight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight_recommendation" ADD CONSTRAINT "insight_recommendation_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "insight"("id") ON DELETE CASCADE ON UPDATE CASCADE;
