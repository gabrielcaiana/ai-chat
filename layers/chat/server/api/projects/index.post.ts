import { createProject } from "../../repository/projectRepository";
import { CreateProjectSchema } from "../../schema";

export default defineEventHandler(async (event) => {
  const { success, data } = await readValidatedBody(
    event,
    CreateProjectSchema.safeParse
  );

  if (!success) {
    return 400;
  }

  const { name } = data;

  return createProject({ name });
});
