import UserModel from "@/models/User";
import connectdb from "@/lib/dbconnect";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
  await  connectdb()

  try {

    const {username, email, password} = await request.json()

  const existedUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if(existedUser){
    console.log( "User with email or username already exists");
     return Response.json({
                success: false,
                message: "User with email or username already exists"
            }, {status: 400})
    
  }

  const hashedpassword = await bcrypt.hash(password, 10)

  const newUser = await UserModel.create({
    username,
    email,
    password: hashedpassword,
  })

 

  return Response.json({
  success: true,
  message: "User registered successfully",
}, { status: 201 })

    
  } catch (error) {

     console.error('error registering user', error);
        return Response.json({
            success: false,
            message: "error registering user"
        },
        {
            status: 500
        }
    )
        
    
    
  }
}