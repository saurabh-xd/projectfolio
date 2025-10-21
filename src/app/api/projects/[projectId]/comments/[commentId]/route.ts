import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectdb from "@/lib/dbconnect";
import Comment from "@/models/Comment";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// app/api/projects/[projectId]/comments/[commentId]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; commentId: string }> }
) {
  try {
    await connectdb();
    
    const { projectId, commentId } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Find comment and check ownership
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    if (comment.user.toString() !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    
    // Delete comment
    await Comment.deleteOne({ _id: commentId });
    await ProjectModel.findByIdAndUpdate(projectId, { $inc: { commentsCount: -1 } });
    
    return NextResponse.json({ message: 'Comment deleted' });
    
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}