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

  useEffect(() => {
    axios
      .get("/api/add-projects")
      .then((res) => {
        setProjects(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      })

      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background max-w-6xl mx-auto py-12">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ProjectGrid projects={filteredProjects} loading={loading} />
    </div>
  );
}
