import ProjectModel from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";
import connectdb from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UserModel from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import Like from "@/models/Like";
import Bookmark from "@/models/Bookmark";


// 1.post form data(project details)
// 2. get all projects
// 3. show user THEIR liked projects
// 4. show user THEIR bookmarked projects


export async function POST(request: NextRequest) {
  await connectdb();
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const liveLink = formData.get("liveLink") as string;
    const repoLink = formData.get("repoLink") as string;


    const tagsString = formData.get("tags") as string;
    const tags = JSON.parse(tagsString);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const Image = await cloudinary.uploader.upload(base64Image, {
      folder: "projectfolio",
    });

    const session = await getServerSession(authOptions);

    const user = await UserModel.findOne({ email: session?.user?.email });
    const newProject = await ProjectModel.create({
      name,
      description,
      image: Image.secure_url,
      liveLink,
      repoLink,
      userId: user._id,
      tags,
    });


    return NextResponse.json(
      { success: true, message: "Project saved!", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("error in saving project", error);
    return Response.json(
      {
        success: false,
        message: "error saving project",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectdb();

    const session = await getServerSession(authOptions);
    const user = await UserModel.findOne({ email: session?.user?.email });
    const userId = user?._id;

    const projects = await ProjectModel.find({})
      .populate("userId", "username userimage") // from user document bring only username userimage to add projec details
      .sort({ createdAt: -1 });

    // If user is logged in, check which projects they liked
    if (userId) {
      const userLikes = await Like.find({ user: userId }).select("project");
      const likedProjectIds = userLikes.map((like) => like.project.toString());

      const userBookmarks = await Bookmark.find({ user: userId }).select(
        "project"
      );
      const bookmarkedProjectIds = userBookmarks.map((bookmark) =>
        bookmark.project.toString()
      );

      const projectsWithData = projects.map((project) => ({
        ...project.toObject(),
        isLiked: likedProjectIds.includes(project._id.toString()),
        isBookmarked: bookmarkedProjectIds.includes(project._id.toString()), // ✅ ADD THIS
      }));

      return NextResponse.json(projectsWithData, { status: 200 });
    }

    // If no user logged in, return projects without isLiked flag
    const projectsWithoutData = projects.map((project) => ({
      ...project.toObject(),
      isLiked: false,
      isBookmarked: false,
    }));

    return NextResponse.json(projectsWithoutData, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
