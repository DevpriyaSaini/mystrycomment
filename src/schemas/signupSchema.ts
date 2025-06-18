import {z} from "zod"
import { email } from "zod/v4"

export const usernamevalid=z.string()
.min(2,"user must be atleast 2 character")
.max(20,"user name must not be more then 20 words")
.regex(/^[a-zA-Z0-9]+$/,"username must not contain special character")


export const signupSchema=z.object({
username:usernamevalid,
email:z.string().email({message:"Invalid email"}),
password:z.string().min(6,{message:"password must be atleast 6 char"})
})