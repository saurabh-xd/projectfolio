"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/landing/Header";
import ProjectGrid from "@/components/landing/ProjectGrid";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  // sort by latest or oldest
  const sortedProjects = [...tagFiltered].sort((a, b) => {
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
      />

      <ProjectGrid projects={sortedProjects} loading={loading} />
    </div>
  );
}
