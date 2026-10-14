// GET /api/compare/runs/[id] — one run with all per-model results
import { getRunById } from '../../../repository/runRepository';

export default defineEventHandler(async event => {
  const { id } = getRouterParams(event) as { id: string };
  const run = await getRunById(id);
  if (!run) throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  return run;
});
