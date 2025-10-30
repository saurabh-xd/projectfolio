import connectdb from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";
import UserModel from "@/models/User";


export async function POST(request: NextRequest){
    try {
        await connectdb();
      
        // Get user from session
          const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

       const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

     // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'projectfolio/users',
    });

      // Update user in database
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      { userimage: uploadResult.secure_url },
      { new: true }
    );

   if(!updatedUser){
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
   }

    return NextResponse.json({
      success: true,
      message: 'Profile image updated',
      userimage: uploadResult.secure_url,
    });


    } catch (error) {
          console.error('Error updating profile image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
    }
}