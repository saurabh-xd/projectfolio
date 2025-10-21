import { NextRequest, NextResponse } from 'next/server';

import Like from '@/models/Like';
import Project from '@/models/Project';
import connectdb from '@/lib/dbconnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request:NextRequest,   { params }: { params: Promise<{ projectId: string }> }) {
  try {
    await connectdb();
    
     const { projectId } = await params;
      const session = await getServerSession(authOptions);

   const userId = session?.user?.id; // Get from your auth middleware

      console.log('ProjectId:', projectId); 
    console.log('UserId:', userId);
    
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