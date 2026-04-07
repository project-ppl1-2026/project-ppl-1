-- CreateTable
CREATE TABLE "baseline" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isBeginner" BOOLEAN NOT NULL DEFAULT true,
    "mlConfidenceScore" DECIMAL(65,30),
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "baseline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mood_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moodScore" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mood_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "baseline_userId_key" ON "baseline"("userId");

-- CreateIndex
CREATE INDEX "mood_log_userId_idx" ON "mood_log"("userId");

-- AddForeignKey
ALTER TABLE "baseline" ADD CONSTRAINT "baseline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mood_log" ADD CONSTRAINT "mood_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
