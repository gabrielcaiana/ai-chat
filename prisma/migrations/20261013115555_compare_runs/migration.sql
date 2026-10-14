-- CreateEnum
CREATE TYPE "RunResultStatus" AS ENUM ('success', 'error');

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunResult" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" "RunResultStatus" NOT NULL,
    "output" TEXT NOT NULL DEFAULT '',
    "error" TEXT,
    "finishReason" TEXT,
    "ttftMs" INTEGER,
    "latencyMs" INTEGER,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "costUsd" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RunResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Run_createdAt_idx" ON "Run"("createdAt");

-- CreateIndex
CREATE INDEX "RunResult_runId_idx" ON "RunResult"("runId");

-- AddForeignKey
ALTER TABLE "RunResult" ADD CONSTRAINT "RunResult_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;
