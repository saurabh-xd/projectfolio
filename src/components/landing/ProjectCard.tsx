import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Bookmark, MessageCircleCode, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProjectCardProps = {
  project: Project;
  likeState?: {
    isLiked: boolean;
    likesCount: number;
  };
   bookmarkState?: {
    isBookmarked: boolean;
  };
  onLike: (projectId: string) => void;
  onBookmark: (projectId: string) => void;
};

function ProjectCard({ project, likeState, onLike, bookmarkState, onBookmark  }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/projects/${project._id}`)}
      key={project._id}
      className="overflow-hidden hover:shadow-lg transition-shadow group pt-0 gap-3 rounded-md cursor-pointer"
    >
      <CardHeader className="p-0">
        {project.image && (
          <div className="relative h-48 overflow-hidden ">
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="w-full h-full object-cover  transition-transform duration-300"
            />
          </div>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 pt-0  ">
        <div className="flex justify-between mb-4">
          {/* User Profile + Title */}
          <div className="flex items-start gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {project.userId?.userimage ? (
                <Image
                  src={project.userId.userimage}
                  alt={
                    project.userId?.username?.charAt(0).toUpperCase() ?? "User"
                  }
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary font-semibold text-sm">
                  {project.userId?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>

            {/* Title & User Name */}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-base line-clamp-1 text-foreground">
                {project.name}
              </h2>
              <p className="text-xs text-muted-foreground/70">
                by{" "}
                <span className="font-medium text-muted-foreground">
                  {project.userId?.username || "Anonymous"}
                </span>
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3 text-xs font-medium ml-2">
            {project.repoLink && (
              <Link
                href={project.repoLink}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
            )}
            {project.liveLink && (
              <Link
                href={project.liveLink}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                className="flex items-center gap-1.5 text-primary/80 hover:text-primary transition-colors"
              >
                <svg
                  className="size-6"
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
              </Link>
            )}
          </div>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {project.tags.map((tag, index) => (
              <Badge
                className="rounded-sm text-[10px] px-2 py-0.5 font-medium bg-muted hover:bg-muted/80 text-muted-foreground"
                variant="secondary"
                key={index}
                onClick={(e) => e.stopPropagation()}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="mt-4" />
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="px-3 pt-0 justify-around flex gap-2">
        <button
          className="flex gap-1.5  hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onLike(project._id);
          }}
        >
          <ThumbsUp
            className={`size-4 transition-all ${
              likeState?.isLiked ? "fill-primary text-primary" : ""
            }`}
          />
          <span className="text-xs font-medium">
            {likeState?.likesCount || 0}
          </span>
        </button>

        <button
          className="flex gap-1.5  hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${project._id}#comments`);
          }}
        >
          <MessageCircleCode className="size-4" />
          <span className="text-xs font-medium">
            {project.commentsCount || 0}
          </span>
        </button>


        <button 
        className="flex gap-1.5  hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
          onClick={(e)=>{
            e.stopPropagation();
            onBookmark(project._id);
          }}
          >
          <Bookmark className={`size-4 transition-all ${
            bookmarkState?.isBookmarked ? 'fill-primary text-primary' : ''
          }`} />
        </button>
      </CardFooter>
    </Card>
  );
}

export default ProjectCard;
