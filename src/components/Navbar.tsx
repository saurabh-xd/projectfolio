"use client";
import React, { useState } from "react";
import Link from "next/link";
import {useSession} from "next-auth/react"

import { Button } from "./ui/button";
import { CircleUserRound, CodeXml, Menu, Moon, Sun, Upload, X } from "lucide-react";
import { useTheme } from "next-themes";


function Navbar() {

    const { data: session } = useSession()
  
   const { theme, setTheme } = useTheme();
   const [open, setOpen] = useState(false)

  
  return (
    <nav className="sticky top-0 z-50 p-4 md:p-6 shadow-md border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex justify-between items-center">
        
       
        <Link href="/" className=" flex items-center font-bold gap-2">
         <CodeXml className="text-primary" />
  <span className="text-xl font-sans ">Projectfolio</span>
</Link>



        <div className="hidden md:flex items-center gap-4">
          
         
            
                 <Link href='/upload'>
           <Button variant={"outline"} className="w-full md:w-auto cursor-pointer rounded-2xl border font-bold hover:text-foreground" >
              <Upload strokeWidth={3}/>  Upload Project
              </Button>
          </Link>
              
          {
            session ? (

               <Link href='/profile'>
           <Button  className="w-full md:w-auto cursor-pointer rounded-2xl border " >
               <CircleUserRound strokeWidth={3}  /> <span className="font-bold text-foreground">Profile</span>
              </Button>
          </Link>

        
            ) : (

  <Link href='/sign-in'>
           <Button  className="w-full md:w-auto cursor-pointer rounded-2xl border font-bold" >
                SIGN IN
              </Button>
          </Link>
            )

}

           
           <Button 
  variant="outline" 
  size="icon" 
  className="rounded-3xl cursor-pointer hover:text-foreground"
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
>
  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
  <span className="sr-only">Toggle theme</span>
</Button>
          
             
      
          
          
        
          
        
          
        
        </div>
         <Button 
          onClick={() => setOpen(!open)}
          variant="outline" 
          size="icon"
          className="md:hidden rounded-full hover:text-foreground"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>  
      </div>
      
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg">
          <div className="container mx-auto p-4 flex flex-col gap-3">
            <Link href='/upload' onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full cursor-pointer rounded-2xl border font-bold hover:text-foreground">
                <Upload className="w-4 h-4 mr-2" strokeWidth={3} />
                Upload Project
              </Button>
            </Link>
            
            {session ? (
              <Link href='/profile' onClick={() => setOpen(false)}>
                <Button className="w-full cursor-pointer rounded-2xl border">
                  <CircleUserRound className="w-4 h-4 mr-2" strokeWidth={3} />
                  <span className="font-bold text-primary-foreground">Profile</span>
                </Button>
              </Link>
            ) : (
              <Link href='/sign-in' onClick={() => setOpen(false)}>
                <Button className="w-full cursor-pointer rounded-2xl border font-bold">
                  SIGN IN
                </Button>
              </Link>
            )}

            {/* Mobile Theme Toggle */}
            <Button 
              variant="outline" 
              className="w-full rounded-2xl cursor-pointer hover:text-foreground"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setOpen(false);
              }}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
