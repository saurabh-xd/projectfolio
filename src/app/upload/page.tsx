"use client"
import React, { useState } from "react"
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
import { Spinner } from "@/components/ui/spinner"
import { Upload, X } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(2000),
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
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
   setLoading(true)

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
    } finally{
      setLoading(false)
    }
  } 

   //  Handle image selection and preview
  const handleImageChange = (file: File | undefined, onChange: (value: File | undefined) => void) => {
    if (file) {
      onChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // ADD: Remove image
  const handleRemoveImage = (onChange: (value: File | undefined) => void) => {
    onChange(undefined)
    setImagePreview(null)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background py-8 px-4">
      <div className="w-full max-w-2xl p-8 space-y-8  rounded-xl bg-card border border-border shadow-lg">
        <h1 className="text-3xl font-bold text-center">Upload Project</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

     <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                    
                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full min-h-64 object-cover rounded-lg border-2 border-border"
                          />
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(field.onChange)}
                            className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            <div className="w-12 h-12 mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <p className="mb-2 text-sm font-semibold text-foreground">
                              Click to upload image
                            </p>
                            <p className="text-xs font-mono text-muted-foreground">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageChange(e.target.files?.[0], field.onChange)
                            }
                          />
                        </label>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

            </div>

            <Button type="submit" 
            disabled={loading} 
            className="w-full cursor-pointer flex justify-center items-center gap-2 h-11">
            {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Project
                </>
              )}
              </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page
