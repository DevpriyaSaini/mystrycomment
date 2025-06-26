import connectiondb from "@/lib/dbConnect";
import usermodel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import{User}from "next-auth"


export async function POST(request:Request) {
     await connectiondb();
    const session=await getServerSession(authOptions)
  const user: User = session?.user as User;

   if(!session||!session.user){
    return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
   }
   const userId=user._id;
    const { acceptMessages } = await request.json();
   try {
   const updateduser= await usermodel.findByIdAndUpdate(userId,{
        isAcceptingMess:acceptMessages
    },{new:true})

   if (!updateduser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updateduser,
      },
      { status: 200 }
    );


   } catch (error) {
     console.log("failed to update user status to accept messages");
     
     return Response.json({
            success:false,
            message:"failed to update user status "
        },{status:500})
   }
}


export async function GET(request: Request) {
  // Connect to the database
  await connectiondb();

  // Get the user session
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await usermodel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMess: foundUser.isAcceptingMess,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}
