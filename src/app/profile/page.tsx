'use client'

import { signOut, useSession } from "next-auth/react"
import {  User, Mail, FolderKanban, LogIn  } from "lucide-react"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Project } from '@/types/project';
import { useRouter } from "next/navigation";



function ProfilePage() {

  const router = useRouter();
  const {data: session, status} = useSession();
  const [projects, setprojects] = useState<Project[]>([]);

  const logout = async ()=> {
    await signOut({ callbackUrl: "/" })
    toast("Logout Successful")
  }

  

  useEffect(()=>{
    axios
    .get('/api/user-projects')
    .then((res)=> {
      setprojects(res.data);
      console.log(res.data);
      
    })
    .catch((err)=>{
      console.log("error fetching projects", err);
      
    })
  },[])
  
  if(status === "loading"){
     return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

   
if(!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Not Logged In</h2>
          <p className="text-muted-foreground">Please sign in to view your profile</p>
          <Link href="/sign-in">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }
  const avatarLetter = session.user?.username?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || "U";
  



  return (
   <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Card */}
        <div className="bg-card rounded-2xl shadow-lg border  border-border overflow-hidden">
          
 <div className="h-32 bg-accent"></div>  

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar - positioned to overlap header */}
            <div className="flex items-end space-x-6 -mt-16 mb-6">
<div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-xl border-4 border-card">         
         <span className="text-5xl font-bold text-primary-foreground">{avatarLetter}</span>
              </div>
              
              <div className="pb-7">
                <h1 className="text-3xl font-bold font-sans text-foreground">
                  {session.user?.username || "User"}
                </h1>
                
              </div>
            </div>


            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* Username */}
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Username</p>
                  <p className="text-foreground font-medium">{session.user?.username}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  <p className="text-foreground font-medium">{session.user?.email}</p>
                </div>
              </div>

              <div className="flex justify-center md:col-span-2 mt-4">
                  <Button
                  variant={"destructive"}
      onClick={logout}
      className="w-full md:w-auto cursor-pointer rounded-xl "
    >
      Logout
    </Button>
              </div>


            </div>
          </div>
        </div>

        {/* Projects Card */}
         <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex  items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderKanban className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-lg font-medium text-foreground mb-2">No projects yet</p>
              <p className="text-sm text-muted-foreground mb-4">Create your first project to get started</p>
              <Link href="/upload">
                <Button>Upload Project</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  onClick={() => router.push(`/projects/${project._id}`)}
                  key={project._id}
                  className="group relative bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-primary/50"
                >
                  {/* Image Section */}
                  {project.image && (
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        likes {project.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        comments {project.commentsCount || 0}
                      </span>
                    </div>

                    {/* Links Section */}
                    <div className="flex gap-3 pt-3 border-t border-border">
                      {project.repoLink && (
                        <Link 
                          onClick={(e) => e.stopPropagation()}
                          href={project.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          Code
                        </Link>
                      )}
                      {project.liveLink && (
                        <Link
                          onClick={(e) => e.stopPropagation()}
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProfilePage