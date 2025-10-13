"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/landing/Header";
import CardSkeleton from "@/components/landing/CardSkeleton";
import ProjectGrid from "@/components/landing/ProjectGrid";

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
    <div className="min-h-screen bg-background dark:bg-background py-12">

     <Header/>

    
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">

           {loading
            ? 
             <CardSkeleton/>
            : 
         <ProjectGrid projects={projects} />
         }
        </div>
      </div>
    </div>
  );
}