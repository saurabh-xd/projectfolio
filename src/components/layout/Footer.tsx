import React from "react";
import Link from "next/link";
import {  Github, Twitter, Linkedin, Heart } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 bg-background mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-5 sm:gap-4 md:flex-row md:justify-between">
            
          {/* Built with love */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground/95 order-2 md:order-1">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>by</span>
            <Link 
              href="https://x.com/_saurabh__xd" 
              target="_blank"
              className="font-medium text-foreground/90 hover:text-foreground transition-colors"
            >
              Saurabh
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground order-1 md:order-2">
            © {currentYear} Projectfolio 
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-5 sm:gap-4 order-3">
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
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/saurabh-garkoti-784191322/" 
              target="_blank" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;