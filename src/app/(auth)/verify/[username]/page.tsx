'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { Apiresponse } from '@/types/Apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifyemail} from '@/schemas/verifySchema';
import { toast } from "sonner"

function VerifyAccount() {
 const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifyemail>>({
    resolver: zodResolver(verifyemail),
  });

  const onSubmit = async (data: z.infer<typeof verifyemail>) => {
    try {
        const response = await axios.post<Apiresponse>(`/api/verify-email`, {
        username: params.username,
        code: data.code,

      });
      toast(response.data.message);
        router.replace('/sign-in');
    } catch (error) {
        const axiosError = error as AxiosError<Apiresponse>;
        toast(axiosError.response?.data.message ??
          'An error occurred. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount