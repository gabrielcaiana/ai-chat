import {
  updateProject,
  getProjectById,
} from "../../repository/projectRepository";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const project = await getProjectById(id as string);
  if (!project) return null;
  const body = await readBody(event);
  return updateProject(id as string, { name: body.name });
});
