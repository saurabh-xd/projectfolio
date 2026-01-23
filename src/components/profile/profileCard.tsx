import React from 'react'
import { Spinner } from '../ui/spinner'
import { LogOut, Mail, User } from 'lucide-react'
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
          
 <div className="h-20 sm:h-24 md:h-32 bg-accent"></div>  

          {/* Profile Content */}
          <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            {/* Avatar - positioned to overlap header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-6 -mt-12 sm:-mt-14 md:-mt-16 mb-4 sm:mb-6">

           <div className="relative">
  {/* Avatar Circle */}
  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-xl border-4 border-card overflow-hidden">
    { session.user?.userimage ? (
      <Image
        src={ session.user?.userimage }
        alt="Profile"
        width={100}
        height={100}
        className="w-full  h-full object-cover"
      />
    ) : (
      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground">
        {avatarLetter}
      </span>
    )}
  </div>

  {/* Pencil Edit Button */}
  <button
    onClick={() => document.getElementById('avatar-upload')?.click()}
    disabled={isUploadingImage}
    className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-card border-2 border-border rounded-full shadow-md flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
    title="Change profile picture"
  >
    {isUploadingImage ? (
      <Spinner className="w-3 h-3 sm:w-4 sm:h-4" />
    ) : (
      <svg
        className="w-3 h-3 sm:w-4 sm:h-4 text-foreground"
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
              
              <div className="pb-0 sm:pb-7 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans text-foreground">
                  {session.user?.username || "User"}
                </h1>
              </div>
            </div>


            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* Username */}
              <div className="flex items-center space-x-3 p-3 sm:p-4 bg-muted rounded-xl border border-border">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Username</p>
                  <p className="text-foreground font-medium text-sm sm:text-base truncate">{session.user?.username}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 p-3 sm:p-4 bg-muted rounded-xl border border-border">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  <p className="text-foreground font-medium text-sm sm:text-base truncate">{session.user?.email}</p>
                </div>
              </div>

              <div className="flex justify-center md:col-span-2 mt-4">
                  <Button
                  variant={"destructive"}
      onClick={logout}
      className="w-full sm:w-auto cursor-pointer dark:hover:bg-destructive/50 rounded-xl h-9 sm:h-10 text-sm"
       disabled={isLoggingOut}
    >
      {
        isLoggingOut ? (
          <>
           <Spinner  />
      Logging out...
      </>
        ) : ( <> Logout <LogOut /> </> ) 
      }
      
    </Button>
              </div>


            </div>
          </div>
        </div>
  )
}
