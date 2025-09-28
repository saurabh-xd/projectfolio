import mongoose from "mongoose";
import ProjectModel from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";
import connectdb from "@/lib/dbconnect";
import path from "path";
import { writeFile } from "fs/promises";


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
    
        const newProject = await ProjectModel.create({
            name,
            description,
            image: imageUrl,
            liveLink,
            repoLink
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