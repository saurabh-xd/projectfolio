import connectdb from "@/lib/dbconnect";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";
import {getServerSession} from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";


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
    .sort({createdAt: -1});

    return NextResponse.json(
      userProjects,
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