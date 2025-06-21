import { message } from "@/model/User";
export interface Apiresponse{
    success:boolean;
    message:string;
    isAccepting?:boolean;
    messages?:Array<message>;
}