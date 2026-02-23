import { Project } from "@/types/project";

interface FilterParams {
  projects: Project[];
  searchQuery: string;
  sortBy: "latest" | "oldest";
  selectedTag: string | null;
  showTopOnly: boolean;
}

export function useProjectFilters({
  projects,
  searchQuery,
  sortBy,
  selectedTag,
  showTopOnly,
}: FilterParams) {
  // search
  const searchFiltered = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // tag filter
  const tagFiltered = selectedTag
    ? searchFiltered.filter((project) =>
        project.tags?.includes(selectedTag)
      )
    : searchFiltered;

  // top 3 by likes
  const topFiltered = showTopOnly
    ? [...tagFiltered]
        .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
        .slice(0, 3)
    : tagFiltered;

  // date sort 
  const sortedProjects = showTopOnly
    ? topFiltered
    : [...topFiltered].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortBy === "latest" ? dateB - dateA : dateA - dateB;
      });

  return { projects: sortedProjects };
}
