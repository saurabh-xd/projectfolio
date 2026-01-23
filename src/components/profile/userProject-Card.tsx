'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { FolderKanban, Trash2 } from 'lucide-react'
import { Project } from '@/types/project'
import axios from 'axios'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ProjectCard from '../landing/ProjectCard'

type EmptyState = {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

type ProjectsCardProps = {
  projects: Project[];
  loading?: boolean;
  emptyState?: EmptyState;
  showDelete?: boolean;
  onProjectDeleted?: (projectId: string) => void; 
}

export default function ProjectsCard({projects, loading=false, emptyState, showDelete=false, onProjectDeleted}: ProjectsCardProps ) {
    
 const { data: session } = useSession();
 const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
 
 // Track likes and bookmarks state locally
 const [projectLikes, setProjectLikes] = useState<Record<string, { isLiked: boolean; likesCount: number }>>(() => {
   return projects.reduce((acc, project) => ({
     ...acc,
     [project._id]: {
       isLiked: project.isLiked || false,
       likesCount: project.likesCount || 0,
     },
   }), {});
 });

 const [projectBookmarks, setProjectBookmarks] = useState<Record<string, { isBookmarked: boolean }>>(() => {
   return projects.reduce((acc, project) => ({
     ...acc,
     [project._id]: {
       isBookmarked: project.isBookmarked || false,
     },
   }), {});
 });

 // Update state when projects prop changes
 React.useEffect(() => {
   setProjectLikes(projects.reduce((acc, project) => ({
     ...acc,
     [project._id]: {
       isLiked: project.isLiked || false,
       likesCount: project.likesCount || 0,
     },
   }), {}));
   setProjectBookmarks(projects.reduce((acc, project) => ({
     ...acc,
     [project._id]: {
       isBookmarked: project.isBookmarked || false,
     },
   }), {}));
 }, [projects]);

 const defaultEmptyState: EmptyState = {
    icon: <FolderKanban className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />,
    title: "No projects yet",
    description: "Post your first project to get started",
    buttonText: "Upload Project",
    buttonHref: "/upload"
  };

   const emptyStateConfig = emptyState || defaultEmptyState;

   const handleDeleteProject = async (projectId: string, e: React.MouseEvent) =>{
    e.stopPropagation();

    setDeletingProjectId(projectId);

    try {
      await axios.delete(`/api/projects/${projectId}`);
      toast.success('Project deleted successfully')

      if(onProjectDeleted){
        onProjectDeleted(projectId)
      }

    } catch (error: unknown) {
      console.error('Error deleting project:', error);
      
       if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      toast.error("You can only delete your own projects");
    } else {
      toast.error("Failed to delete project");
    }
  } else {
    toast.error("Something went wrong");
  }
    } finally {
      setDeletingProjectId(null);
    }
  };

  // Like handler
  const handleLike = async (projectId: string) => {
    if (!session) {
      toast.error("Please sign in to like projects");
      return;
    }

    const currentState = projectLikes[projectId];
    
    setProjectLikes((prev) => ({
      ...prev,
      [projectId]: {
        isLiked: !currentState?.isLiked,
        likesCount: currentState?.isLiked
          ? (currentState?.likesCount || 1) - 1
          : (currentState?.likesCount || 0) + 1,
      },
    }));

    try {
      const response = await axios.post(`/api/projects/${projectId}/like`);
      const data = response.data;

      setProjectLikes((prev) => ({
        ...prev,
        [projectId]: {
          isLiked: data.isLiked,
          likesCount: data.likesCount,
        },
      }));
    } catch (error) {
      // Revert on error
      setProjectLikes((prev) => ({
        ...prev,
        [projectId]: currentState,
      }));
      toast.error("Failed to update like");
    }
  };

  // Bookmark handler
  const handleBookmark = async (projectId: string) => {
    if (!session) {
      toast.error("Please sign in to bookmark projects");
      return;
    }

    const currentState = projectBookmarks[projectId];

    setProjectBookmarks((prev) => ({
      ...prev,
      [projectId]: {
        isBookmarked: !currentState?.isBookmarked,
      },
    }));

    try {
      const response = await axios.post(`/api/projects/${projectId}/bookmark`);
      const data = response.data;

      setProjectBookmarks((prev) => ({
        ...prev,
        [projectId]: {
          isBookmarked: data.isBookmarked,
        },
      }));
    } catch (error) {
      // Revert on error
      setProjectBookmarks((prev) => ({
        ...prev,
        [projectId]: currentState,
      }));
      toast.error("Failed to update bookmark");
    }
  };

    if (loading) {
    return (
      <div className="bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-36 sm:h-48 rounded-xl mb-3 sm:mb-4"></div>
              <div className="bg-muted h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-muted h-3 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
      <div className="bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-6 md:p-8">
        {projects.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            {emptyStateConfig.icon}
            <p className="text-base sm:text-lg font-medium text-foreground mb-2">
              {emptyStateConfig.title}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              {emptyStateConfig.description}
            </p>
            <Link href={emptyStateConfig.buttonHref}>
              <Button className="h-9 sm:h-10 text-sm">{emptyStateConfig.buttonText}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {projects.map((project) => (
              <div key={project._id} className="relative group">
                {showDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10 h-7 w-7 sm:h-8 sm:w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                        disabled={deletingProjectId === project._id}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent >
                      <AlertDialogHeader>
                        <AlertDialogTitle >Delete Project</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                         { `Are you sure you want to delete "${project.name}"? This will also delete all comments, likes, and bookmarks. This action cannot be undone.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter >
                        <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => handleDeleteProject(project._id, e)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <ProjectCard
                  project={project}
                  likeState={projectLikes[project._id]}
                  bookmarkState={projectBookmarks[project._id]}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              </div>
            ))}
          </div>
        )}
      </div>
  )
}
