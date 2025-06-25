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
import { signinveri } from '@/schemas/signinSchema';
import { signIn } from 'next-auth/react';

function page() {

const router=useRouter();

//zod implimentation
const form=useForm<z.infer<typeof signinveri >>({
  resolver:zodResolver(signinveri),
  defaultValues: {
    identifier:'',
    password:''
  },
})

const onSubmit = async (data: z.infer<typeof signinveri>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast('Incorrect username or password');
      } else {
        toast(result.error);
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };


 

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign-In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/username</FormLabel>
                  <Input {...field} name="email" />
                 
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
            <Button type="submit" className='w-full' >Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
             Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page