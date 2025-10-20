
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import Comment from '@/models/Comment';
import ProjectModel from '@/models/Project';
import connectdb from '@/lib/dbconnect';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectdb();
    
    const { projectId } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { text } = await request.json(); // Get comment text from body
    
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
    }
    
    // Create comment
    const comment = await Comment.create({
      user: userId,
      project: projectId,
      text: text.trim()
    });
    
    // Increment comments count
    await ProjectModel.findByIdAndUpdate(projectId, { $inc: { commentsCount: 1 } });
    
    return NextResponse.json({ 
      message: 'Comment added',
      comment 
    });
    
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectdb();
    
    const { projectId } = await params;
    
    // Fetch comments with user info
    const comments = await Comment.find({ project: projectId })
      .populate('user', 'username image') // Populate user details
      .sort({ createdAt: -1 }); // Newest first
    
    return NextResponse.json(comments);
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}