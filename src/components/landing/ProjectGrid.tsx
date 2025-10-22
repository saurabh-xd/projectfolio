"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react' // ADDED: useState import
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MessageCircleCode, ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react'; // ADDED: For auth check (adjust based on your auth)
import { toast } from 'sonner';
 // ADDED: For error notifications (adjust based on your toast setup)

// UPDATED: Added isLiked and likesCount fields
import { Project } from '@/types/project';

import { useRouter } from 'next/navigation';

type ProjectGridProps = {
  projects: Project[];
};

function ProjectGrid({ projects}: ProjectGridProps) {

const router = useRouter();

const [projectLikes, setProjectLikes] = useState<Record<string, { 
  isLiked: boolean; 
  likesCount: number; 
 
}>>({});







  const { data: session } = useSession(); // ADDED: Get user session (adjust based on your auth)
   // ADDED: Toast for notifications (adjust based on your setup)

 useEffect(() => {
  const likesState = projects.reduce((acc, project) => ({
    ...acc,
    [project._id]: {
      isLiked: project.isLiked,
      likesCount: project.likesCount,
      
    }
  }), {});
  setProjectLikes(likesState);
}, [projects]);


  // ADDED: Like handler function
 const handleLike = async (projectId: string) => {
  const currentState = projectLikes[projectId];
  
  // Optimistic update
  setProjectLikes(prev => ({
    ...prev,
    [projectId]: {
      isLiked: !currentState.isLiked,
      likesCount: currentState.isLiked ? currentState.likesCount - 1 : currentState.likesCount + 1,
     
    }
  }));

  try {
    const response = await fetch(`/api/projects/${projectId}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed');
    
    const data = await response.json();
    
    setProjectLikes(prev => ({
      ...prev,
      [projectId]: { ...prev[projectId],}
    }));
    
  } catch (error) {
    // Revert on error
    setProjectLikes(prev => ({
      ...prev,
      [projectId]: {
        isLiked: currentState.isLiked,
        likesCount: currentState.likesCount,
      
      }
    }));
  }
};
  return (
    <>
     { projects.map((project) => {
       // ADDED: Get like state for this specific project
       const likeState = projectLikes[project._id];

       return (

        
      
        
   <Card  onClick={() => router.push(`/projects/${project._id}`)}
   key={project._id} 
   className="overflow-hidden hover:shadow-lg transition-shadow group pt-0 rounded-md cursor-pointer">
  {/* Image - No padding/space */}
  <CardHeader className='p-[2px]'>
  {project.image && (
    <div className="relative h-48 overflow-hidden rounded-md">
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  )}
  </CardHeader>

  {/* Content */}
  <CardContent className="p-4 pt-0 space-y-6">
    {/* User Profile + Title */}
    <div className="flex items-start gap-3">
      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                   {'U' }     {/*   should image here */}
                      </div>
      </div>
      
      {/* Title & User Name */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-base line-clamp-1 text-foreground">
          {project.name}
        </h2>
        <p className="text-xs text-muted-foreground">
          by { 'Anonymous'}
        </p>
      </div>
    </div>

    {/* Description */}
    {/* <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
      {project.description}
    </p> */}

    {/* Links */}
    <div className="flex gap-3 text-xs font-medium ml-2">
      {project.repoLink && (
        <Link
          href={project.repoLink}
          target="_blank"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </Link>
      )}
      {project.liveLink && (
        <Link
          href={project.liveLink}
          target="_blank"
          className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Live Demo
        </Link>
      )}
    </div>
  </CardContent>

  {/* Footer Actions */}
  <CardFooter className="px-3 pt-0 flex gap-2">
    <Button 
      variant="outline" 
      size="sm"
      className="flex-1 gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
      onClick={(e) => {
     e.stopPropagation(); 
     handleLike(project._id);
  }}
    >
      <ThumbsUp 
        className={`w-4 h-4 transition-all ${
          likeState?.isLiked 
            ? 'fill-primary text-primary' 
            : ''
        }`}
      />
      <span className="text-xs font-medium">{likeState?.likesCount || 0}</span>
    </Button>

    <Button 
      variant="outline" 
      size="sm"
      className="flex-1 gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
      
      onClick={(e) => {
  e.stopPropagation();
  router.push(`/projects/${project._id}#comments`);
}}
    >
      <MessageCircleCode className="w-4 h-4" />
      <span className="text-xs font-medium">{project.commentsCount || 0}</span>
    </Button>
  </CardFooter>
</Card>



       )
     })
        }
          </>
  )
}

export default ProjectGrid