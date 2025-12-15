import React from "react";
import Link from "next/link";
import {  Github, Twitter} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 bg-background mt-auto">
      <div className="container mx-auto px-4 py-12">
      

        
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {currentYear} ProjectFolio 
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link 
                href="https://github.com/saurabh-xd" 
                target="_blank" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/_saurabh__xd" 
                target="_blank" 
                className="text-muted-foreground hover:text-foreground transition-colors"
               
              >
                <Twitter className="w-5 h-5" />
              </Link>
             
             
            </div>

          </div>
        </div>

     
    </footer>
  );
}

export default Footer;