"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
  _id: string;
  name: string;
  description: string;
  image?: string;
  repoLink?: string;
  liveLink?: string;
};

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([]); 
  const [loading, setLoading] = useState(true);

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

      .finally(()=>{
        setLoading(false);
      });
  }, []);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-neutral-300 to-neutral-900 bg-clip-text text-transparent mb-4">
          PROJECTS
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4">
          Explore our curated collection of innovative projects
        </p>
       
      </div>

      {/* Projects Container - Centered with side margins */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">

           {loading
            ? 
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 bg-white p-4 rounded-2xl shadow">
                  <Skeleton className="h-[125px] w-full rounded-xl bg-gray-300 dark:bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-[80%] bg-gray-300 dark:bg-gray-700" />
                  </div>
                </div>
              ))
            : 
          projects.map((project) => (
            <div
              key={project._id}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
            >
              {/* Image Section */}
              {project.image && (
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}

              {/* Content Section */}
              <div className="p-4">
                <h2 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1  transition-colors">
                  {project.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Links Section */}
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  {project.repoLink && (
                    <Link
                      href={project.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:gap-2 transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </Link>
                  )}
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 hover:gap-2 transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span>Live Demo</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}