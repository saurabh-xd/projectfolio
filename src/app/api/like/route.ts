import { NextResponse } from "next/server";
import connectdb from "@/lib/dbconnect";
import LikeModel from "@/models/like";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  await connectdb();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await req.json();
  const userId = session.user.id;

  const existing = await LikeModel.findOne({ userId, projectId });

  if (existing) {
    // Unlike
    await LikeModel.deleteOne({ _id: existing._id });
    const likeCount = await LikeModel.countDocuments({ projectId });
    return NextResponse.json({ success: true, liked: false, likeCount });
  } else {
    // Like
    await LikeModel.create({ userId, projectId });
    const likeCount = await LikeModel.countDocuments({ projectId });
    return NextResponse.json({ success: true, liked: true, likeCount });
  }
}
