"use client";
import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Project } from "@/types/project";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import CardSkeleton from "../common/CardSkeleton";

type ProjectGridProps = {
  projects: Project[];
  loading: boolean;
};

function ProjectGrid({ projects, loading }: ProjectGridProps) {
  const { data: session } = useSession();

  const [projectLikes, setProjectLikes] = useState<
    Record<
      string,
      {
        isLiked: boolean;
        likesCount: number;
      }
    >
  >({});

  const [projectBookmarks, setProjectBookmarks] = useState<
    Record<
      string,
      {
        isBookmarked: boolean;
      }
    >
  >({});

  useEffect(() => {
    const likesState = projects.reduce(
      (acc, project) => ({
        ...acc,
        [project._id]: {
          isLiked: project.isLiked,
          likesCount: project.likesCount,
        },
      }),
      {}
    );
    setProjectLikes(likesState);

const bookmarksState = projects.reduce((acc, project) => ({
      ...acc,
      [project._id]: {
        isBookmarked: project.isBookmarked,
      }
    }), {});
    setProjectBookmarks(bookmarksState);

  }, [projects]);

  // Like handler function
  const handleLike = async (projectId: string) => {
    if (!session) {
      toast.error("Please sign in to like projects");
      return;
    }

    const currentState = projectLikes[projectId];

    setProjectLikes((prev) => ({
      ...prev,
      [projectId]: {
        isLiked: !currentState.isLiked,
        likesCount: currentState.isLiked
          ? currentState.likesCount - 1
          : currentState.likesCount + 1,
      },
    }));

    try {
      const response = await axios.post(`/api/projects/${projectId}/like`);

      const data = await response.data;

      setProjectLikes((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          isLiked: data.isLiked,
          likesCount: data.likesCount,
        },
      }));
    } catch (error) {
      toast.error("Failed to update like. Please try again.");

      setProjectLikes((prev) => ({
        ...prev,
        [projectId]: {
          isLiked: currentState.isLiked,
          likesCount: currentState.likesCount,
        },
      }));
    }
  };

const handleBookmark = async (projectId: string) => {
    if (!session) {
      toast.error('Please sign in to bookmark projects');
      return;
    }

    const currentState = projectBookmarks[projectId];

    // Optimistic update
    setProjectBookmarks(prev => ({
      ...prev,
      [projectId]: {
        isBookmarked: !currentState.isBookmarked,
      }
    }));

    try {
      const response = await axios.post(`/api/projects/${projectId}/bookmark`);
      const data = response.data;

      setProjectBookmarks(prev => ({
        ...prev,
        [projectId]: {
          isBookmarked: data.isBookmarked,
        }
      }));

      toast.success(data.isBookmarked ? 'Project bookmarked' : 'Bookmark removed');

    } catch (error) {
      toast.error('Failed to update bookmark');
      
      // Revert on error
      setProjectBookmarks(prev => ({
        ...prev,
        [projectId]: {
          isBookmarked: currentState.isBookmarked,
        }
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 ">
      {loading ? (
        <CardSkeleton />
      ) : (
        projects.map((project) => {
          //  like state for this specific project
          const likeState = projectLikes[project._id];
          const bookmarkState = projectBookmarks[project._id];

          return (
            <ProjectCard
              key={project._id}
              project={project}
              likeState={likeState}
              onLike={handleLike}
               bookmarkState={bookmarkState}
               onBookmark={handleBookmark}
            />
          );
        })
      )}
    </div>
  );
}

export default ProjectGrid;
