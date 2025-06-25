"use client"
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch';
import { message, User } from '@/model/User'
import { acceptmessage } from '@/schemas/acceptmessSchema'
import { Apiresponse } from '@/types/Apiresponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from 'lucide-react';
import Messcard from '@/components/messcard';

function page() {
  const [messages,setMessage]=useState<message[]>([])
  const [isloading,setLoading]=useState(false);
  const[isswitch,setIsswitch]=useState(false);
  
  const handleDelete=(messageId:string)=>{
    setMessage(messages.filter((message)=>message._id!==messageId))
  }
  const {data:session}=useSession();
  const form = useForm({
    resolver: zodResolver(acceptmessage),
  });
   const { register, watch, setValue } = form;
   const acceptMessages = watch('acceptmessa');

    const fetchAcceptMessages = useCallback(async () => {
    setIsswitch(true);
    try {
      const response = await axios.get<Apiresponse>('/api/accept-messages');
      setValue('acceptmessa', response.data.isAcceptingMess);
    } catch (error) {
      const axiosError = error as AxiosError<Apiresponse>;
      toast(axiosError.response?.data.message ??
          'Failed to fetch message settings');
    } finally {
      setIsswitch(false);
    }
  }, [setValue, toast]);

   const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsswitch(false);
      try {
        const response = await axios.get<Apiresponse>('/api/get-messages');
        setMessage(response.data.messages || []);
        if (refresh) {
          toast('Showing latest messages');
        }
      } catch (error) {
        const axiosError = error as AxiosError<Apiresponse>;
        toast( axiosError.response?.data.message ?? 'Failed to fetch messages');
      } finally {
        setLoading(false);
        setIsswitch(false);
      }
    },
    [setLoading, setMessage, toast]
  );

 useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  //handle switch
 const handleSwitchChange = async () => {
    try {
      const response = await axios.post<Apiresponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptmessa', !acceptMessages);
      toast( response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<Apiresponse>;
      toast(axiosError.response?.data.message ??
          'Failed to update message settings');
    }
  };



   if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('Profile URL has been copied to clipboard.');
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptmessa')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isswitch}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Messcard
              key={message._id}
              message={message}
              onMessageDelete={handleDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page