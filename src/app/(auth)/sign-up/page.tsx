"use client"
import React, { useDebugValue, useEffect, useState } from 'react'
import *as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useDebounceValue,useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import axios,{AxiosError} from "axios"
import { signupSchema } from '@/schemas/signupSchema';
import { Apiresponse } from '@/types/Apiresponse';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

function page() {

const [username,setUsername]=useState("");
const[usernameMessage,setUsernameMessage]=useState("");
const[ischeckingusername,setischeckingusername]=useState(false);
const[isSubmit,setIssubmit]=useState(false);

const debounced=useDebounceCallback(setUsername,300);
const router=useRouter();

//zod implimentation
const form=useForm<z.infer<typeof signupSchema>>({
  resolver:zodResolver(signupSchema),
  defaultValues: {
    username:'',
    email:'',
    password:''
  },
})
useEffect(()=>{
  const checkuserunique=async()=>{
    if(username){
      setischeckingusername(true);
      setUsernameMessage('');
      try {
        const response=await axios.get(`/api/check-username-unique?username=${username}`);
        setUsernameMessage(response.data.message);

      } catch (error) {
        const axiosError=error as AxiosError<Apiresponse>
        setUsernameMessage(axiosError.response?.data.message??"Error checking username")
        
      }
      finally{
        setischeckingusername(false)
      }
    }
  }
  checkuserunique();
},[username])

const onsubmit=async(data:z.infer<typeof signupSchema>)=>{
try {
  const response=await axios.post<Apiresponse>("/api/sign-up",data);
  toast(response.data.message);
  router.replace(`/verify/${username}`)
  setIssubmit(false)
} catch (error) {
  console.error("Error in sign-up of user",error);
  const axiosError=error as AxiosError<Apiresponse>
let errorMess=axiosError.response?.data.message;
toast(errorMess);

  setIssubmit(false);
  
}

}
  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value||"");
                    }}
                  />
                  {ischeckingusername && <Loader2 className="animate-spin" />}
                  {!ischeckingusername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmit}>
              {isSubmit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page