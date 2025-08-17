import {
  updateProject,
  getProjectById,
} from '../../repository/projectRepository';
import { UpdateProjectSchema } from '../../schema';

export default defineEventHandler(async event => {
  const { id } = getRouterParams(event);
  const project = await getProjectById(id as string);
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
