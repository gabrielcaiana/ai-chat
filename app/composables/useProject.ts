import type { Project } from "~/types";

export default function useproject(projectId: string) {
  const { projects } = useProjects();

  const project = computed(() =>
    projects.value.find((project) => project.id === projectId)
  );

  const updateProject = (updateProject: Partial<Project>) => {
    if (!project) return;

    const index = projects.value.findIndex(
      (project) => project.id === updateProject.id
    );

    if (index === -1) return;

    projects.value[index] = {
      ...project.value,
      ...updateProject,
      id: "1",
      name: "New Project",
    };
  };

  return {
    project,
    updateProject,
  };
}
