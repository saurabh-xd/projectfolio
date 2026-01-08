import { authOptions } from "@/lib/authOptions";
import connectdb from "@/lib/dbconnect";
import Bookmark from "@/models/Bookmark";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Project from '@/models/Project';

// bookmarking project
export async function POST(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }){


    try {
        await connectdb();

        const { projectId } = await params;
        const session = await getServerSession(authOptions)

         const userId = session?.user?.id; // Get from your auth middleware

             
            
             const existingBookmark = await Bookmark.findOne({
               user: userId,
               project: projectId
             });
         
             let isBookmarked = false;
             
             if (existingBookmark) {
               // Unbookmark
               await Bookmark.deleteOne({ _id: existingBookmark._id });
               
           
               isBookmarked =false
             } else {
               // bookmark
               await Bookmark.create({
                 user: userId,
                 project: projectId
               });
              
            
                isBookmarked =true
             }
             
             
                 return NextResponse.json({
               message: isBookmarked ? "Project bookmarked" : "Bookmark removed",
               isBookmarked,
               
             });
         
           } catch (error) {
             return NextResponse.json(
             { success: false, message: "Failed to toggle bookmark" },
      { status: 500 }
             );
           }
        
    

}
 
