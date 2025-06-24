import connectiondb from "@/lib/dbConnect";
import usermodel from "@/model/User"; 



export async function POST(request:Request) {
    await connectiondb();

    try {

        const {username,code}=await request.json();
     
        

      //  const decodeuser= decodeURIComponent(username);
       
       
      const user= await usermodel.findOne({username});
      console.log("user from mongo",user);
      
      if(!user){
        return Response.json({
            success:false,
            message:"user not found"
        },{status:400})
      }
      const isCodevalid=user.verifyCode==code
      const isCodenotEx=new Date(user.verifyCodeExpiry)>new Date()

      if(isCodevalid&&isCodenotEx){
        user.isVerified=true;
        await user.save();
         return Response.json({
            success:true,
            message:"Account verified successfully"
        },{status:200})
      }
      else if(!isCodenotEx){
        return Response.json({
            success:false,
            message:"Account verification code expired Please sign-up again"
        },{status:400})
      }
      else{
        return Response.json({
            success:false,
            message:"Incorrect verification code"
        },{status:400})
      }
        
    } catch (error) {
        console.error("Error verifying user",error);
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{status:500})
    }
}