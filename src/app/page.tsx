"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/landing/Header";
import ProjectGrid from "@/components/landing/ProjectGrid";
import { Project } from "@/types/project";

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTopOnly, setShowTopOnly] = useState<boolean>(false);

  //Fetch projects
  useEffect(() => {
    axios
      .get("/api/add-projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const searchFiltered = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //filter by tag
  const tagFiltered = selectedTag
    ? searchFiltered.filter((project) => project.tags?.includes(selectedTag))
    : searchFiltered;

  // filter top 3 by likes if enabled
  const topFiltered = showTopOnly
    ? [...tagFiltered]
        .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
        .slice(0, 3)
    : tagFiltered;

  // sort by latest or oldest (skip if showTopOnly to preserve likes order)
  const sortedProjects = showTopOnly
    ? topFiltered
    : [...topFiltered].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return sortBy === "latest" ? dateB - dateA : dateA - dateB;
      });

  return (
    <div className="min-h-screen bg-background max-w-6xl mx-auto py-12">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        projectCount={sortedProjects.length}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        showTopOnly={showTopOnly}
        setShowTopOnly={setShowTopOnly}
      />

      <ProjectGrid
        projects={sortedProjects}
        loading={loading}
        showTopOnly={showTopOnly}
      />
    </div>
  );
}
