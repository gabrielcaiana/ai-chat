import {
  updateProject,
  getProjectByIdForUser,
} from '../../repository/projectRepository';
import { UpdateProjectSchema } from '../../schema';

export default defineEventHandler(async event => {
  const { id } = getRouterParams(event);
  const userId = await getAuthenticatedUserId(event);

  // Verify user owns the project
  const project = await getProjectByIdForUser(id as string, userId);
  if (!project) return null;

  const { success, data } = await readValidatedBody(
    event,
    UpdateProjectSchema.safeParse
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project Not Found',
    });
  }

  const { name } = data;

  return updateProject(id as string, { name });
});
