"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import {  useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'


const formSchema = z.object({
    username:  z.string().min(2).max(50),
    email:     z.string().email(),
    password:  z.string().min(2).max(50)
})

function Signup() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    const router = useRouter()

    async  function onSubmit(values: z.infer<typeof formSchema>){

        try {
            const res = await axios.post('/api/signup', values)

            if(res.data.success){
              await signIn("credentials", {
                redirect: true,
                email: values.email,
                password: values.password,
                callbackUrl: "/profile",
              });
            }

            toast.success("user registered successfully")

            router.push("/")
        } catch (error: any) {
            toast.error("error in signup")
            console.log(error.message);
            
        }
    }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 dark:bg-background'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white dark:bg-card rounded-lg shadow-md'>
             <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Sign up</h1>
             
          </div>
             <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter Username" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        /> 
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter Email" type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter Password " type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
        <Button type="submit" className='cursor-pointer'>Sign Up</Button>
      </form>
    </Form>

    <div className="mt-4 text-center">
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

export default Signup