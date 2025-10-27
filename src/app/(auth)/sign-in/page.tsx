'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import  { signIn }  from "next-auth/react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'


const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(2).max(50)    
    
})

function Signin() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof signInSchema>)=>{
       setIsLoading(true) 
        try {
           const result = await signIn('credentials',
       { redirect: false,
        email: values.email,
        password: values.password }
      )
      if(result?.error){
         toast("signIn failed", {
          description: "incorrect email or password"
         })
      }
  
      if(result?.ok){
          toast.success("sign in successfully")
          router.replace('/')
      }
        } catch (error) {
            toast.error("Something went wrong")
        }finally{
          setIsLoading(false)
        }
    }

    // Handle Google Sign In
const handleGoogleSignIn = async () => {
    await signIn('google', {
        callbackUrl: '/'
    })
}

// Handle GitHub Sign In  
const handleGithubSignIn = async () => {
    await signIn('github', {
        callbackUrl: '/' 
    })
}

  return (
    <div className='flex justify-center items-center min-h-screen bg-background'>
        <div className='w-full max-w-md p-8 space-y-6 bg-card rounded-lg  shadow-md'>
             <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Sign In</h1>
             
          </div>
           {/* Google & GitHub Buttons */}
                <div className="space-y-3">
                    <Button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full"
                        
                    >
                        Continue with Google 
                    </Button>

                    <Button
                        type="button"
                        onClick={handleGithubSignIn}
                        className="w-full"
                        
                    >
                        Continue with GitHub 
                    </Button>
                </div>

                {/* OR divider */}
                <p className="text-center text-muted-foreground ">OR</p>
             <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Input placeholder="Enter Password" type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
       
        <Button type="submit" className=' cursor-pointer' disabled={isLoading}>
          {isLoading ? (
             <>
                <Spinner className="h-4 w-4" />
                Signing in...
              </>
          ) : (  "Sign In" )}
        
          </Button>
      </form>
    </Form>

      <div className="mt-4 text-center">
              <p>
               Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="text-primary hover:text-accent">
                Sign up
                </Link>
              </p>
          </div>
        </div>
    </div>
  )
}

export default Signin