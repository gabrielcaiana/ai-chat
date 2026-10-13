// runRepository.ts — persistence for side-by-side comparison runs
import prisma from '../../../base/server/utils/prisma';
import type { CompareResult } from '../services/compare-service';

const withResults = {
  results: { orderBy: { position: 'asc' as const } },
};

export async function createRun(prompt: string, results: CompareResult[]) {
  return prisma.run.create({
    data: {
      prompt,
      results: {
        create: results.map(r => ({
          position: r.position,
          provider: r.provider,
          model: r.model,
          status: r.status,
          output: r.output,
          error: r.error,
          finishReason: r.finishReason,
          ttftMs: r.ttftMs,
          latencyMs: r.latencyMs,
          inputTokens: r.inputTokens,
          outputTokens: r.outputTokens,
          costUsd: r.costUsd,
        })),
      },
    },
    include: withResults,
  });
}

export async function listRuns(take = 20) {
  return prisma.run.findMany({
    orderBy: { createdAt: 'desc' },
    take,
    include: withResults,
  });
}

export async function getRunById(id: string) {
  return prisma.run.findUnique({ where: { id }, include: withResults });
}
