import { message } from "@/model/User";
export interface Apiresponse{
    success:boolean;
    messages:string;
   isAcceptingMess?:any;
    message?:any;
}