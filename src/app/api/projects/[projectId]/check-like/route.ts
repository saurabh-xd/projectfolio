// app/api/projects/[projectId]/check-like/route.js
import { NextRequest, NextResponse } from 'next/server';

import Like from '@/models/Like';
import connectdb from '@/lib/dbconnect';

export async function GET(request:NextRequest,  { params }: { params: { projectId: string } }) {
  try {
    await connectdb();
    
    const { projectId } = params;
    const userId = (request as any).userId; // Get from your auth middleware
    
    const like = await Like.findOne({
      user: userId,
      project: projectId
    });
    
    return NextResponse.json({ isLiked: !!like });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}