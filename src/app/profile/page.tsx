'use client'

import { useSession } from "next-auth/react"
import {  User, Mail, FolderKanban, LogIn  } from "lucide-react"


function ProfilePage() {
  const {data: session, status} = useSession();

  
  
  if(status === "loading"){
     return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

   
  if(!session) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Not Logged In</h2>
          <p className="text-gray-600">Please sign in to view your profile</p>
        </div>
      </div>
  )
};
  const avatarLetter = session.user?.username?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || "U";
  



  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="h-32  bg-green-200"></div>
          
          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar - positioned to overlap header */}
            <div className="flex items-end space-x-6 -mt-16 mb-6">
              <div className="w-32 h-32 bg-blue-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-5xl font-bold text-white">{avatarLetter}</span>
              </div>
              
              <div className="pb-7">
                <h1 className="text-3xl font-bold text-gray-900">
                  {session.user?.username || "User"}
                </h1>
                
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* Username */}
              <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-xl">
                <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 " />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Username</p>
                  <p className="text-gray-900 font-medium">{session.user?.username}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-xl">
                <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 " />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-gray-900 font-medium">{session.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
          </div>
          
          {/* Empty state */}
          <div className="text-center py-12 text-gray-500">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-700 mb-2">No projects yet</p>
            <p className="text-sm">Create your first project to get started</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage