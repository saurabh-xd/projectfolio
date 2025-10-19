// app/api/projects/[projectId]/like/route.js
import { NextRequest, NextResponse } from 'next/server';

import Like from '@/models/Like';
import Project from '@/models/Project';
import connectdb from '@/lib/dbconnect';

export async function POST(request:NextRequest,  { params }: { params: { projectId: string } }) {
  try {
    await connectdb();
    
    const { projectId } = params;
    const userId = (request as any).userId; // Get from your auth middleware
    
    // Check if already liked
    const existingLike = await Like.findOne({
      user: userId,
      project: projectId
    });
    
    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      await Project.findByIdAndUpdate(projectId, { $inc: { likesCount: -1 } });
      
      return NextResponse.json({ 
        message: 'Unliked', 
        isLiked: false 
      });
    } else {
      // Like
      await Like.create({
        user: userId,
        project: projectId
      });
      await Project.findByIdAndUpdate(projectId, { $inc: { likesCount: 1 } });
      
      return NextResponse.json({ 
        message: 'Liked', 
        isLiked: true 
      });
    }
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}