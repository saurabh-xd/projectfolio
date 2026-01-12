import { ArrowDown, ArrowDownAZ, ArrowUp, ArrowUpAZ, Search, X } from 'lucide-react';
import React from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "latest" | "oldest";
  setSortBy: (sort: "latest" | "oldest") => void;
  projectCount: number;
}

function Header({searchQuery, setSearchQuery, sortBy, setSortBy, projectCount}: HeaderProps) {
  return (
    <div className="text-center mb-4 space-y-6">

      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold">
          Explore {" "}
          <span className="text-primary">Projects</span>
        </h1>
        
        <p className="text-muted-foreground max-w-xl mx-auto px-2">
          Showcase your projects and discover inspiring ones
        </p>
      </div>
      
      {/* Search Bar */}
        <div className="max-w-2xl mx-auto  px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 rounded-full "
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

       <div className="flex items-center justify-start gap-4 text-sm">
        {/* <span className="text-muted-foreground">
          {projectCount} {projectCount === 1 ? 'project' : 'projects'}
        </span> */}
        
        <Select value={sortBy} onValueChange={(value: "latest" | "oldest") => setSortBy(value)} >
          <SelectTrigger className="w-37 h-9 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">
             
              
                Latest
              
            </SelectItem>
            <SelectItem value="oldest">
              
                
                Oldest
             
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
     
    </div>
  )
}

export default Header