"use client";
import React, { useState, } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

const tags = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "JavaScript",
  "vibe-coding",
  "Mobile App",
  "Landing Page",
  "Portfolio",
  "UI/UX",
  "AI/ML",
  "CLI",
  "Open Source",
  "Side Project",
  "Game",
  "Desktop App",
];

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(2000),
  image: z.instanceof(File, { message: "Image is required" }),
  liveLink: z.string().url("Must be a valid URL"),
  repoLink: z.string().url("Must be a valid URL"),
  tags: z.array(z.string()).min(1, "Select at least 1 tag"),
});

function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tags: [],
      liveLink: "",
      repoLink: "",
      description: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (
    e: React.DragEvent,
    onChange: (value: File | undefined) => void,
  ) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageChange(file, onChange);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("tags", JSON.stringify(values.tags));
      formData.append("description", values.description);
      formData.append("liveLink", values.liveLink);
      formData.append("repoLink", values.repoLink);
      if (values.image) formData.append("image", values.image);

      await axios.post("/api/add-projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Project uploaded successfully");
      router.replace("/");
    } catch (error) {
      toast.error("Project upload failed");
    } finally {
      setLoading(false);
    }
  };

  //  Handle image selection and preview
  const handleImageChange = (
    file: File | undefined,
    onChange: (value: File | undefined) => void,
  ) => {
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ADD: Remove image
  const handleRemoveImage = (onChange: (value: File | undefined) => void) => {
    onChange(undefined);
    setImagePreview(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background py-6 sm:py-8 px-4 sm:px-4">
      <div className="w-full max-w-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 rounded-xl bg-card border border-border shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Upload Project
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ?
                        <div className="relative group">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="w-full min-h-48 sm:min-h-64 object-cover rounded-lg border-2 border-border"
                          />
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(field.onChange)}
                            className="absolute top-2 right-2 p-1.5 sm:p-2 bg-destructive text-destructive-foreground rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      : <label
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, field.onChange)}
                          className={cn(
                            "flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                            isDragging ?
                              "border-primary bg-primary/10"
                            : "border-border bg-muted/30 hover:bg-muted/50",
                          )}
                        >
                          <div className="flex flex-col items-center justify-center pt-4 pb-5 sm:pt-5 sm:pb-6 text-center px-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </div>
                            <p className="mb-1 sm:mb-2 text-sm font-semibold text-foreground">
                              Click or drag & drop an image
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
                              handleImageChange(
                                e.target.files?.[0],
                                field.onChange,
                              )
                            }
                          />
                        </label>
                      }
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Tags</FormLabel>
                    <MultiSelect
                      onValuesChange={field.onChange}
                      values={field.value}
                    >
                      <FormControl>
                        <MultiSelectTrigger className="w-full cursor-pointer">
                          <MultiSelectValue placeholder="Select tags..." />
                        </MultiSelectTrigger>
                      </FormControl>
                      <MultiSelectContent>
                        <MultiSelectGroup>
                          {tags.map((tag) => (
                            <MultiSelectItem key={tag} value={tag}>
                              {tag}
                            </MultiSelectItem>
                          ))}
                        </MultiSelectGroup>
                      </MultiSelectContent>
                    </MultiSelect>
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
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                      />
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
                      <Input
                        type="url"
                        placeholder="https://github.com/user/repo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer flex justify-center items-center gap-2 h-10 sm:h-11 text-sm sm:text-base mt-2 sm:mt-0"
            >
              {loading ?
                <>
                  <Spinner className="h-4 w-4" />
                  Uploading...
                </>
              : <>
                  <Upload className="h-4 w-4" />
                  Upload Project
                </>
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
