"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { MoveLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
} from "@/components/ui/alert-dialog";
import { AxiosError } from "axios";

interface User {
  _id: string;
  username: string;
  userimage?: string | null;
}

interface Comment {
  _id: string;
  text: string;
  user: User;
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  image?: string;
  repoLink?: string;
  liveLink?: string;
  likesCount?: number;
  commentsCount?: number;
  tags?: string[];
}

export default function ProjectCommentsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: session } = useSession();

  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [deleteComment, setDeleteComment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        const data = response.data;
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}/comments`);
        const data = response.data;
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [projectId]);

  // Add comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setIsCommenting(true);

    try {
      const response = await axios.post(`/api/projects/${projectId}/comments`, {
        text: commentText,
      });

      const newComment = await response.data;
      setComments([newComment.comment, ...comments]); // Add to top
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  // delete comment

  const handleDeleteComment = async (commentId: string) => {
    setDeleteComment(commentId);

    try {
      await axios.delete(`/api/projects/${projectId}/comments/${commentId}`);

      setComments(comments.filter((comment) => comment._id !== commentId));

      if (project) {
        setProject({
          ...project,
          commentsCount: Math.max(0, (project.commentsCount || 0) - 1),
        });
      }

      toast.success("Comment deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting comment:", error);

    if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      toast.error("You can only delete your own comments");
    } else {
      toast.error("Failed to delete comment");
    }
  } else {
    toast.error("Something went wrong");
  }
    } finally {
      setDeleteComment(null);
    }
  };

  const canDeleteComment = (comment: Comment) => {
    if (!session?.user) return false;

    return (
      comment.user._id === session.user.id ||
      comment.user.username === session.user.username
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Back button */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors mb-6 inline-flex gap-2 items-center text-sm font-medium"
        >
          <MoveLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* LEFT SIDE - Project Details */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Project Details</h1>

            {project ?
              <div className="bg-card rounded-lg p-4 sm:p-6 border">
                {/* Project Image */}
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.name}
                    height={400}
                    width={800}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                  />
                )}

                {/* Project Info */}
                <h2 className="text-xl sm:text-2xl font-bold ">
                  {project.name}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  {/* Links */}
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {project.repoLink && (
                      <Link
                        href={project.repoLink}
                        target="_blank"
                        className="text-muted-foreground hover:underline flex items-center gap-1.5 text-sm sm:text-base"
                      >
                        <svg
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </Link>
                    )}
                    {project.liveLink && (
                      <Link
                        href={project.liveLink}
                        target="_blank"
                        className="text-green-600 hover:underline flex items-center gap-1.5 text-sm sm:text-base"
                      >
                        <svg
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5"
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
                        Live Demo
                      </Link>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>{project.likesCount || 0} likes</span>
                    <span>{project.commentsCount || 0} comments</span>
                  </div>
                </div>
              </div>
            : <div className="bg-card rounded-lg p-4 sm:p-6 border space-y-4">
                <Skeleton className="w-full h-48 sm:h-56 md:h-64 rounded-lg" />
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            }
          </div>

          {/* RIGHT SIDE - Comments Section */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Comments</h2>

            {/* Add Comment Box */}
            {session ?
              <div className="bg-card rounded-lg p-3 sm:p-4 border">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full border rounded p-2 sm:p-3 mb-2 min-h-20 sm:min-h-25 resize-none text-sm sm:text-base"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={isCommenting || !commentText.trim()}
                  className="w-full sm:w-auto"
                >
                  {isCommenting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            : <div className="bg-card rounded-lg p-3 sm:p-4 border text-center">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Please login to comment
                </p>
              </div>
            }

            {/* Comments List */}
            <div className="space-y-3 sm:space-y-4">
              {loading ?
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-card rounded-lg p-3 sm:p-4 border"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              : comments.length === 0 ?
                <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">
                  No comments yet. Be the first to comment!
                </div>
              : comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-card rounded-lg p-3 sm:p-4 border"
                  >
                    <div className="flex items-start gap-2.5 ">
                      {/* User Avatar */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold overflow-hidden">
                        {comment.user?.userimage ?
                          <Image
                            src={comment.user?.userimage}
                            alt="avatar"
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        : <span className="text-primary font-semibold text-xs sm:text-sm">
                            {comment.user?.username?.charAt(0).toUpperCase() ||
                              "U"}
                          </span>
                        }
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm sm:text-base">
                              {comment.user?.username || "Anonymous"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          {canDeleteComment(comment) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className=" text-destructive hover:text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/20 cursor-pointer shrink-0"
                                  disabled={deleteComment === comment._id}
                                >
                                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Comment
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this
                                    comment? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer ">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteComment(comment._id)
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>

                        <p className=" sm:mt-2 text-sm sm:text-base break-words">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
