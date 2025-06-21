import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { Apiresponse } from "@/types/Apiresponse";
import { string, success } from "zod/v4";
 import { Resend } from 'resend';




export async function sendverification(
      email:string,
    username:string,
    verifycode:string
) :Promise<Apiresponse>{
  
    try {
        

const resend = new Resend('re_123456789');

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: ' Mystry Message verification code',
  react: VerificationEmail({username,otp:verifycode})
});

         return {success:true, message:" verification code send successfully"}
    } catch (error) {
        console.error("Error sending Emails",error);
        return {success:false, message:"failsed to send verification code"}
        
    }
}