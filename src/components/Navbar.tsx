"use client";
import React from "react";
import Link from "next/link";
import {useSession} from "next-auth/react"

import { Button } from "./ui/button";
import { CircleUserRound, CodeXml, Moon, Sun, Upload } from "lucide-react";
import { useTheme } from "next-themes";


function Navbar() {

    const { data: session } = useSession()
  
   const { theme, setTheme } = useTheme();

  
  return (
    <nav className="p-4 md:p-6 shadow-md border-b-2 bg-background">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
       
        <Link href="/" className=" flex items-center font-bold gap-2 mb-4 md:mb-0">
         <CodeXml className="text-primary" />
  <span className="text-xl font-sans ">Projectfolio</span>
</Link>



        <div className="flex gap-4.5">
          
         
            <>
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
          
             
            </>
          
          
        
          
        
          
        
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
