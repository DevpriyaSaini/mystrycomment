import {z} from "zod";

export const message=z.object({
    content:z.string().min(10,"content must be atleast 10 charactert")
    .max(300,"content must be no longer than 300 charactert")
})