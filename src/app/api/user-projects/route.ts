import connectdb from "@/lib/dbconnect";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";
import Like from "@/models/Like";
import Bookmark from "@/models/Bookmark";
import {getServerSession} from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from '@/lib/authOptions';


export async function GET(req: NextRequest){

    try {
        const session = await getServerSession(authOptions);
        if(!session) return new Response("Unauthorized", { status: 401 });


        await connectdb();
        const user = await UserModel.findOne({email: session.user.email});

        if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userProjects = await ProjectModel.find({userId: user._id})
    .populate('userId', 'username userimage')
    .sort({createdAt: -1});

    // Get project IDs
    const projectIds = userProjects.map(project => project._id);

    // Get user's likes for these projects
    const userLikes = await Like.find({
      user: user._id,
      project: { $in: projectIds }
    }).select('project');

    const likedProjectIds = userLikes.map(like => like.project.toString());

    // Get user's bookmarks for these projects
    const userBookmarks = await Bookmark.find({
      user: user._id,
      project: { $in: projectIds }
    }).select('project');

    const bookmarkedProjectIds = userBookmarks.map(bookmark => bookmark.project.toString());

    // Format response with isLiked and isBookmarked
    const projectsWithStatus = userProjects.map(project => ({
      ...project.toObject(),
      isLiked: likedProjectIds.includes(project._id.toString()),
      isBookmarked: bookmarkedProjectIds.includes(project._id.toString())
    }));

    return NextResponse.json(
      projectsWithStatus,
      { status: 200 }
    )
        
    } catch (error) {
          console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
        
    }
}