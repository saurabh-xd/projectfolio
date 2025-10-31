"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';

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
        const response = await axios.get(`/api/projects/${projectId}`);
        const data =  response.data;
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
        const response = await axios.get(`/api/projects/${projectId}/comments`);
        const data =  response.data;
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
      const response = await axios.post(`/api/projects/${projectId}/comments`,{ text: commentText} )
      
      
      
        const newComment = await response.data;
        setComments([newComment.comment, ...comments]); // Add to top
        setCommentText('');
      }
     catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE - Project Details */}
          <div className="space-y-4">
            <h1 className="text-3xl  font-bold">Project Details</h1>
            
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
                      className="text-muted-foreground hover:underline flex items-center gap-1.5"
                    >
                       <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
                      GitHub 
                    </Link>
                  )}
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      className="text-green-600 hover:underline flex items-center gap-1.5"
                    >
                   <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>   Live Demo 
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
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center  flex-shrink-0 font-bold overflow-hidden">
                        {
                          comment.user?.userimage ? (
                             <img
        src={ comment.user?.userimage }
        alt="avatar"
        className="w-full h-full object-cover"
      />
                          ) : (
                             <span className="text-primary font-semibold text-sm">
                                   { comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                          )
                        }
                       
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