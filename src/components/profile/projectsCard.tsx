'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { FolderKanban } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Project } from '@/types/project'
import { Badge } from '../ui/badge'

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
  emptyState?: EmptyState
}

export default function ProjectsCard({projects, loading=false, emptyState}: ProjectsCardProps ) {
    
 const router = useRouter();

 const defaultEmptyState: EmptyState = {
    icon: <FolderKanban className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />,
    title: "No projects yet",
    description: "Post your first project to get started",
    buttonText: "Upload Project",
    buttonHref: "/upload"
  };

   const emptyStateConfig = emptyState || defaultEmptyState;

    if (loading) {
    return (
      <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-xl mb-4"></div>
              <div className="bg-muted h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-muted h-3 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
      <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          {/* <div className="flex  items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
          </div> */}
          
          {projects.length === 0 ? (
        <div className="text-center py-12">
          {emptyStateConfig.icon}
          <p className="text-lg font-medium text-foreground mb-2">
            {emptyStateConfig.title}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {emptyStateConfig.description}
          </p>
          <Link href={emptyStateConfig.buttonHref}>
            <Button>{emptyStateConfig.buttonText}</Button>
          </Link>
        </div>
      ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  onClick={() => router.push(`/projects/${project._id}`)}
                  key={project._id}
                  className="group relative bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-primary/50"
                >
                  {/* Image Section */}
                  {project.image && (
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">
                      {project.name}
                    </h3>
                    
                     {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                 <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        likes {project.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        comments {project.commentsCount || 0}
                      </span>
                    </div>

                    {/* Links Section */}
                    <div className="flex gap-3 pt-3 border-t border-border">
                      {project.repoLink && (
                        <Link 
                          onClick={(e) => e.stopPropagation()}
                          href={project.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          Code
                        </Link>
                      )}
                      {project.liveLink && (
                        <Link
                          onClick={(e) => e.stopPropagation()}
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  )
}
