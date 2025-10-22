"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProjectCommentsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: session } = useSession();
  
  const [project, setProject] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    
    fetchProject();
  }, [projectId]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/comments`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
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
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      });
      
      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment.comment, ...comments]); // Add to top
        setCommentText('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE - Project Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Project Details</h1>
            
            {project ? (
              <div className="bg-card rounded-lg p-6 border">
                {/* Project Image */}
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                
                {/* Project Info */}
                <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                {/* Links */}
                <div className="flex gap-4">
                  {project.repoLink && (
                    <Link
                      href={project.repoLink}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub →
                    </Link>
                  )}
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      className="text-green-600 hover:underline"
                    >
                      Live Demo →
                    </Link>
                  )}
                </div>
                
                {/* Stats */}
                <div className="mt-6 flex gap-4 text-sm text-muted-foreground">
                  <span> {project.likesCount || 0} likes</span>
                  <span> {project.commentsCount || 0} comments</span>
                </div>
              </div>
            ) : (
              <div>Loading project...</div>
            )}
          </div>

          {/* RIGHT SIDE - Comments Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Comments</h2>
            
            {/* Add Comment Box */}
            {session ? (
              <div className="bg-card rounded-lg p-4 border">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full border rounded p-3 mb-2 min-h-[100px] resize-none"
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={isCommenting || !commentText.trim()}
                >
                  {isCommenting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            ) : (
              <div className="bg-card rounded-lg p-4 border text-center">
                <p className="text-muted-foreground">Please login to comment</p>
              </div>
            )}
            
            {/* Comments List */}
            <div className="space-y-4">
              {loading ? (
                <div>Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-card rounded-lg p-4 border">
                    <div className="flex items-start gap-3">
                      {/* User Avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      
                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="font-semibold">{comment.user?.username || 'Anonymous'}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                        <p className="mt-2">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}