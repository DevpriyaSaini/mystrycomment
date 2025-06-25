import { message } from "@/model/User";
export interface Apiresponse{
    success:boolean;
    message:string;
   isAcceptingMess?:any;
    messages?:Array<message>;
}