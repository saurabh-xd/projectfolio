import { NextRequest, NextResponse } from 'next/server';

import Like from '@/models/Like';
import Project from '@/models/Project';
import connectdb from '@/lib/dbconnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


export async function POST(request:NextRequest,   { params }: { params: Promise<{ projectId: string }> }) {
  try {
    await connectdb();
    
     const { projectId } = await params;
      const session = await getServerSession(authOptions);

   const userId = session?.user?.id; // Get from your auth middleware

    
    // Check if already liked
    const existingLike = await Like.findOne({
      user: userId,
      project: projectId
    });

    let isLiked = false;
    
    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      await Project.findByIdAndUpdate(projectId, { $inc: { likesCount: -1 } });
      
      // return NextResponse.json({ 
      //   message: 'Unliked', 
      //   isLiked: false 
      // });
      isLiked =false
    } else {
      // Like
      await Like.create({
        user: userId,
        project: projectId
      });
      await Project.findByIdAndUpdate(projectId, { $inc: { likesCount: 1 } });
      
      // return NextResponse.json({ 
      //   message: 'Liked', 
      //   isLiked: true 
      // });
       isLiked =true
    }
    
     const updatedProject = await Project.findById(projectId).select("likesCount");
        return NextResponse.json({
      message: isLiked ? "Liked" : "Unliked",
      isLiked,
      likesCount: updatedProject?.likesCount || 0, // ✅ send updated count
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}