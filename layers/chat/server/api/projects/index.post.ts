import { createProject } from '../../repository/projectRepository';
import { CreateProjectSchema } from '../../schema';

export default defineEventHandler(async event => {
  const { success, data } = await readValidatedBody(
    event,
    CreateProjectSchema.safeParse
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const { name } = data;

  return createProject({ name });
});
