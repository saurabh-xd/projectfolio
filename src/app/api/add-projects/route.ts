import ProjectModel from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";
import connectdb from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/authOptions';
import UserModel from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import Like from '@/models/Like';


export async function POST(request: NextRequest){

    await connectdb()
try {
    
        const formData = await request.formData()
        const file = formData.get("image") as File
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const liveLink = formData.get("liveLink") as string
        const repoLink = formData.get("repoLink") as string
    
    
        // let imageUrl = ""
        // if(file){
        //      const bytes = await file.arrayBuffer()
        // const buffer = Buffer.from(bytes)
        // const filePath = path.join(process.cwd(), "public/uploads", file.name)
        // await writeFile(filePath, buffer)
        // imageUrl = `/uploads/${file.name}`
        // }

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




export async function GET(request: NextRequest) {
  try {
    await connectdb();
    
  const session = await getServerSession(authOptions);
const user = await UserModel.findOne({ email: session?.user?.email }); 
const userId = user?._id;
    
    const projects = await ProjectModel.find({})
    .populate('userId', 'username userimage')
    .sort({ createdAt: -1 });
    
    // If user is logged in, check which projects they liked
    if (userId) {
      const userLikes = await Like.find({ user: userId }).select('project');
      const likedProjectIds = userLikes.map(like => like.project.toString());
      
      const projectsWithLikes = projects.map(project => ({
        ...project.toObject(),
        isLiked: likedProjectIds.includes(project._id.toString())
      }));
      
      return NextResponse.json(projectsWithLikes, { status: 200 });
    }
    
    // If no user logged in, return projects without isLiked flag
    const projectsWithoutLikes = projects.map(project => ({
      ...project.toObject(),
      isLiked: false
    }));
    
    return NextResponse.json(projectsWithoutLikes, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}