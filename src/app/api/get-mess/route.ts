import connectiondb from "@/lib/dbConnect";
import usermodel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import{User}from "next-auth"
import mongoose from "mongoose";

export async function GET(request: Request) {
 await connectiondb();
      const session=await getServerSession(authOptions)
     const user:User=session?.user as User
  
     if(!session||!session.user){
      return Response.json({
              success:false,
              message:"Not Authenticated"
          },{status:400})
     }
    
      
      const userId = new mongoose.Types.ObjectId(user._id);
      console.log(userId);
  try {
    const user = await usermodel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$message' },
      { $sort: { 'message.createdAt': -1 } },
      { $group: { _id: '$_id', message: { $push: '$message' } } },
    ]).exec();
    console.log(user);
    

    if (!user || user.length === 0) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: user[0].message },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}