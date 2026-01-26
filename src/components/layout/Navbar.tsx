"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { Button } from "../ui/button";
import {
  CircleUserRound,
  CodeXml,
  Menu,
  Moon,
  Sun,
  Upload,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

function Navbar() {
  const { data: session } = useSession();

  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 px-3 py-3 md:p-5 shadow-md border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center font-bold gap-1.5 md:gap-2">
          <CodeXml className="text-primary size-5 md:size-6" />
          <span className="text-lg md:text-xl font-sans">Projectfolio</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          

          {session ? (
            <Link href="/profile">
              <Button className="w-full md:w-auto cursor-pointer rounded-2xl border ">
                <CircleUserRound strokeWidth={3} />{" "}
                <span className="font-bold text-primary-foreground">Profile</span>
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto cursor-pointer rounded-2xl border font-bold text-primary-foreground">
                SIGN IN
              </Button>
            </Link>
          )}

     {session && (   <Link href="/upload">
            <Button
              variant={"outline"}
              className="w-full md:w-auto cursor-pointer rounded-2xl border font-bold hover:text-foreground"
            >
              <Upload strokeWidth={3} /> Upload Project
            </Button>
          </Link>
       )}

          <Button
            variant="outline"
            size="icon"
            className="rounded-3xl cursor-pointer hover:text-foreground"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile: Sign In/Profile button + Hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          {session ? (
            <Link href="/profile">
              <Button
                size="icon"
                className="rounded-full cursor-pointer size-9"
              >
                <CircleUserRound className="size-5 text-primary-foreground" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button
                size="icon"
                className="rounded-full cursor-pointer size-9"
              >
                <CircleUserRound className="size-5 text-primary-foreground" />
                <span className="sr-only">Sign In</span>
              </Button>
            </Link>
          )}

          <Button
            onClick={() => setOpen(!open)}
            variant="outline"
            size="icon"
            className="rounded-full hover:text-foreground size-9"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0 border-b-0"
        }`}
      >
        <div className="container mx-auto px-3 py-3 flex flex-col gap-2">
          <Link href="/upload" onClick={() => setOpen(false)}>
            <Button
              variant="outline"
              className="w-full cursor-pointer rounded-xl border font-semibold hover:text-foreground h-10 text-sm"
            >
              <Upload className="size-4 mr-2" strokeWidth={2.5} />
              Upload Project
            </Button>
          </Link>

          {session ? (
            <Link href="/profile" onClick={() => setOpen(false)}>
              <Button className="w-full cursor-pointer rounded-xl border h-10 text-sm">
                <CircleUserRound className="size-4 mr-2" strokeWidth={2.5} />
                <span className="font-semibold text-primary-foreground">
                  Profile
                </span>
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in" onClick={() => setOpen(false)}>
              <Button className="w-full cursor-pointer rounded-xl border font-semibold h-10 text-sm">
                SIGN IN
              </Button>
            </Link>
          )}

          {/* Mobile Theme Toggle */}
          <Button
            variant="outline"
            className="w-full rounded-xl cursor-pointer hover:text-foreground h-10 text-sm"
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              setOpen(false);
            }}
          >
            {mounted && resolvedTheme === "dark" ? (
              <>
                <Sun className="size-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="size-4 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
