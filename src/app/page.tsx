"use client";

import { useState } from "react";
import Header from "@/components/landing/Header";
import ProjectGrid from "@/components/landing/ProjectGrid";
import { useProjects } from "@/hooks/useProjects";
import { useProjectFilters } from "@/hooks/useProjectFilters";

export default function ExplorePage() {
  const { projects, loading } = useProjects();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTopOnly, setShowTopOnly] = useState(false);

  const { projects: filteredProjects } = useProjectFilters({
    projects,
    searchQuery,
    sortBy,
    selectedTag,
    showTopOnly,
  });

  return (
    <div className="min-h-screen bg-background max-w-6xl mx-auto py-6">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        projectCount={filteredProjects.length}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        showTopOnly={showTopOnly}
        setShowTopOnly={setShowTopOnly}
      />

      <ProjectGrid
        projects={filteredProjects}
        loading={loading}
        showTopOnly={showTopOnly}
      />
    </div>
  );
}
