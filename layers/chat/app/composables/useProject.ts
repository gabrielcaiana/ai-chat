import type { Project } from "~~/layers/chat/app/types";

export default function useproject(projectId: string) {
  const { projects } = useProjects();

  const project = computed(() =>
    projects.value.find((project) => project.id === projectId)
  );

  const updateProject = async (updateProject: Partial<Project>) => {
    if (!project.value?.id) return;

    const index = projects.value.findIndex((p) => p.id === project.value?.id);

    if (index === -1) return;

    projects.value[index] = {
      ...project.value,
      ...updateProject,
    };
  };

  return {
    project,
    updateProject,
  };
}
