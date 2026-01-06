"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/landing/Header";
import CardSkeleton from "@/components/common/CardSkeleton";
import ProjectGrid from "@/components/landing/ProjectGrid";

import { Project } from '@/types/project';

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([]); 
  const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState(""); 

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


   const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  return (
    <div className="min-h-screen bg-background max-w-7xl mx-auto py-12">

     <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

    
      <div className=" px-8 md:px-16 lg:px-24">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 ">

           {loading
            ? 
             <CardSkeleton/>
            : 
         <ProjectGrid projects={filteredProjects}   />
         }
        </div>
      </div>
    </div>
  );
}