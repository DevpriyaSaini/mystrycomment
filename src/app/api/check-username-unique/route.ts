import connectiondb from "@/lib/dbConnect";
import usermodel from "@/model/User";
import {z}from "zod";
import { usernamevalid } from "@/schemas/signupSchema";


const usernameQuerySchema=z.object({
    username:usernamevalid
})

export  async function GET(request:Request){
   
    

    await connectiondb()

    try {
        const {searchParams}=new URL(request.url);
        const queryParams={
            username:searchParams.get('username')
        }
        //validate with zod
        const result=usernameQuerySchema.safeParse(queryParams)
        console.log(result);//result log
        if(!result.success){
            const usernameError=result.error.format().
            username?._errors||[]
            return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
         );
        }
        const { username } = result.data;
        
        
        const existverifieduser = await usermodel.findOne({
            username: username, // exact match
            isVerified: true
             }).exec();

        console.log("Searching for:", username);
        console.log("Found user:", existverifieduser);
        
         if (existverifieduser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
        
    } catch (error) {
        console.error("Error checking username",error);
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})
        
    }
}