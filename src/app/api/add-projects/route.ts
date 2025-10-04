import ProjectModel from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";
import connectdb from "@/lib/dbconnect";
import path from "path";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import UserModel from "@/models/User";


export async function POST(request: NextRequest){

    await connectdb()
try {
    
        const formData = await request.formData()
        const file = formData.get("image") as File
        const name = formData.get("name") as String
        const description = formData.get("description") as String
        const liveLink = formData.get("liveLink") as String
        const repoLink = formData.get("repoLink") as String
    
    
        let imageUrl = ""
        if(file){
             const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filePath = path.join(process.cwd(), "public/uploads", file.name)
        await writeFile(filePath, buffer)
        imageUrl = `/uploads/${file.name}`
        }

        const session = await getServerSession(authOptions);


     const user = await UserModel.findOne({ email: session?.user?.email });

    
        const newProject = await ProjectModel.create({
            name,
            description,
            image: imageUrl,
            liveLink,
            repoLink,
            userId: user._id,
        })
    
         return NextResponse.json(
        { success: true, message: "Project saved!", project: newProject },
        { status: 201 }
      )
      
} catch (error) {
    console.error('error in saving project', error);
        return Response.json({
            success: false,
            message: "error saving project"
        },
        {
            status: 500
        }
    )
        
    
}

}

export async function GET() {
  try {
    await connectdb();
    const projects = await ProjectModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}