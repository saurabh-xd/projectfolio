import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";
import connectdb from "@/lib/dbconnect";
import Bookmark from "@/models/Bookmark";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//getting single project details
export async function GET(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }){
    try {
        await connectdb();
        const {projectId} = await params;
        const project = await ProjectModel.findById(projectId)

          if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
    
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectdb();
    
    const { projectId } = await params;
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find project
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user owns the project
    if (project.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Not authorized to delete this project" },
        { status: 403 }
      );
    }

    // Delete image from Cloudinary 
    if (project.image) {
      try {
        // Extract public_id from Cloudinary URL
        const publicId = project.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete all related data
    await Promise.all([
      Comment.deleteMany({ project: projectId }), // Delete all comments
      Like.deleteMany({ project: projectId }),     // Delete all likes
      Bookmark.deleteMany({ project: projectId }), // Delete all bookmarks
      ProjectModel.deleteOne({ _id: projectId })   // Delete project
    ]);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}