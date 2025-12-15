import React from 'react'
import { Spinner } from '../ui/spinner'
import { Mail, User } from 'lucide-react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Session } from 'next-auth'


type ProfileCardProps = {
  session: Session
  avatarLetter: string
  isUploadingImage: boolean
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  logout: () => void
  isLoggingOut: boolean
}

export default function ProfileCard( { session, 
  avatarLetter, 
  isUploadingImage, 
  handleImageUpload, 
  logout, 
  isLoggingOut } : ProfileCardProps ) {
  return (
    
        <div className="bg-card rounded-2xl shadow-lg border  border-border overflow-hidden">
          
 <div className="h-32 bg-accent"></div>  

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar - positioned to overlap header */}
            <div className="flex items-end space-x-6 -mt-16 mb-6">

           <div className="relative">
  {/* Avatar Circle */}
  <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-xl border-4 border-card overflow-hidden">
    { session.user?.userimage ? (
      <Image
        src={ session.user?.userimage }
        alt="Profile"
        width={100}
        height={100}
        className="w-full  h-full object-cover"
      />
    ) : (
      <span className="text-5xl font-bold text-primary-foreground">
        {avatarLetter}
      </span>
    )}
  </div>

  {/* Pencil Edit Button */}
  <button
    onClick={() => document.getElementById('avatar-upload')?.click()}
    disabled={isUploadingImage}
    className="absolute bottom-1 right-1 w-9 h-9 bg-card border-2 border-border rounded-full shadow-md flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
    title="Change profile picture"
  >
    {isUploadingImage ? (
      <Spinner className="w-4 h-4" />
    ) : (
      <svg
        className="w-4 h-4 text-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    )}
  </button>

  {/* Hidden File Input */}
  <input
    id="avatar-upload"
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    disabled={isUploadingImage}
    className="hidden"
  />
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
       disabled={isLoggingOut}
    >
      {
        isLoggingOut ? (
          <>
           <Spinner  />
      Logging out...
      </>
        ) : ( "Logout" )
      }
      
    </Button>
              </div>


            </div>
          </div>
        </div>
  )
}
