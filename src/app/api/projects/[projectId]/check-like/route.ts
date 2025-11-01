import { NextRequest, NextResponse } from 'next/server';

import Like from '@/models/Like';
import connectdb from '@/lib/dbconnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request:NextRequest,  { params }: { params: { projectId: string } }) {
  try {
    await connectdb();

    const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { projectId } = params;
   const userId = session.user.id;
    
    const like = await Like.findOne({
      user: userId,
      project: projectId
    });
    
    return NextResponse.json({ isLiked: !!like });
    
  } catch (error) {
    console.error("❌ Error in GET /api/likes/[projectId]:", error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}