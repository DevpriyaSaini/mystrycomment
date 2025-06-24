import mongoose,{Schema,Document} from "mongoose";


export interface message extends Document{
    content:string;
    createdAt:Date
}

const messSchema :Schema<message>=new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})


export interface User extends Document{
   username:string;
   email:string;
   password:string;
   verifyCode:string;
   verifyCodeExpiry:Date;
   isVerified:boolean;
   isAcceptingMess:boolean;
    message:message[]
}

const userschema :Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"user name is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
       match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Robust email regex
      'Please use a valid email address (e.g., user@example.com)'
    ]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
     verifyCode:{
        type:String,
        required:[true,"verifyCode is required"]
    },
     verifyCodeExpiry:{
        type:Date,
        required:[true,"verifyCode is required"]
    },
     isVerified :{
        type:Boolean,
        default:false
    },
    isAcceptingMess:{
        type:Boolean,
        default:true,
    },
    message:[messSchema],

})

const Usermodel = mongoose.models.User || mongoose.model<User>('User', userschema);
export default Usermodel;
