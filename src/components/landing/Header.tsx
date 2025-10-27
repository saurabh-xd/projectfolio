import { Search, X } from 'lucide-react';
import React from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function Header({searchQuery, setSearchQuery}: HeaderProps) {
  return (
    <div className="text-center mb-12 space-y-6">

      <div className="space-y-3">
        <h1 className="text-4xl md:text-6xl font-bold">
          Explore {" "}
          <span className="text-primary">Projects</span>
        </h1>
        
        <p className="text-muted-foreground max-w-xl mx-auto px-4">
          Showcase your projects and discover inspiring ones
        </p>
      </div>
      
      {/* Search Bar */}
        <div className="max-w-2xl mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 rounded-full border-2 focus:border-primary text-base"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
     
    </div>
  )
}

export default Header