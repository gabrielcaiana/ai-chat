// GET /api/compare/runs — latest comparison runs (history list)
import { listRuns } from '../../../repository/runRepository';

export default defineEventHandler(async event => {
  const { take } = getQuery(event);
  const n = Math.min(Math.max(Number(take) || 20, 1), 100);
  return listRuns(n);
});
