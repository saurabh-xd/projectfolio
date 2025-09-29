"use client"
import React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
  image: z.any().optional(), // file input
  liveLink: z.string().url("Must be a valid URL"),
  repoLink: z.string().url("Must be a valid URL"),
})

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      liveLink: "",
      repoLink: "",
    },
  })

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("description", values.description)
      formData.append("liveLink", values.liveLink)
      formData.append("repoLink", values.repoLink)
      if (values.image) formData.append("image", values.image)

      await axios.post("/api/add-projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
     
     
      toast.success("Project uploaded successfully")
      router.replace("/")
    } catch (error) {
      toast.error("Project upload failed")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Add Project</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Live Link */}
            <FormField
              control={form.control}
              name="liveLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Project Link</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Repo Link */}
            <FormField
              control={form.control}
              name="repoLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Link</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="cursor-pointer">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page
