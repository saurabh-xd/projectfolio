import { authOptions } from "@/lib/authOptions";
import connectdb from "@/lib/dbconnect";
import Bookmark from "@/models/Bookmark";
import Like from "@/models/Like";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//get bookmarked project for profile page 
export async function GET(request: NextRequest){
    try {
        await connectdb()
        
         const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }


     const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    //find bookmark project and its details 
    const bookmarks = await Bookmark.find({user: user._id})
    .populate({
        path: 'project',
        populate: {
            
                path: 'userId',
                select: 'username userimage'
            
        }
    })
     .sort({ createdAt: -1 });


 const validBookmarks = bookmarks.filter(bookmark => bookmark.project); //“Keep only bookmarks that still have a project.”
    const projectIds = validBookmarks.map(bookmark => bookmark.project._id); //“From each valid bookmark, extract only the project ID.

 const userLikes = await Like.find({ 
      user: user._id,
      project: { $in: projectIds } //Project must be inside this array -> projectIds.
    }).select('project');

    const likedProjectIds = userLikes.map(like => like.project.toString());

    // Format response
    const bookmarkedProjects = validBookmarks.map(bookmark => ({
      ...bookmark.project.toObject(), // converting in simple js object
      isLiked: likedProjectIds.includes(bookmark.project._id.toString()),
      isBookmarked: true,
      bookmarkedAt: bookmark.createdAt
    }));

     return NextResponse.json(bookmarkedProjects, { status: 200 });
     
     

  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}