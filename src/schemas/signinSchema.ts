import {z} from "zod";

export const signinveri=z.object({
    identifier:z.string(),
    password:z.string()

})