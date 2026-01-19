import { Search, Trophy, X,  } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "latest" | "oldest";
  setSortBy: (sort: "latest" | "oldest") => void;
  projectCount: number;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  showTopOnly: boolean;
  setShowTopOnly: (show: boolean) => void;
};

const tags = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "JavaScript",
  "Mobile App",
  "Landing Page",
  "Portfolio",
  "UI/UX",
];

function Header({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedTag,
  setSelectedTag,
  showTopOnly,
  setShowTopOnly,
}: HeaderProps) {
  return (
    <div className="mb-6 flex flex-col space-y-5">

      {/* Title  + Search*/}
      <div className="space-y-3">

        <h1 className="text-4xl md:text-6xl font-bold text-center">Explore Projects</h1>
        
        {/* Search  */}
      <div className="max-w-2xl mb-10 mx-auto w-full ">
       
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10 h-11 rounded-full focus-visible:ring-[1px]"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
         
        </div>
 
      </div>

      

      {/* Tags and filter */}
      <div className="flex flex-col md:flex-row items-center justify-between  ">

        {/* Left: Sort + Top 3 */}
        <div className="flex items-center gap-2">
           <Select
            value={sortBy}
            onValueChange={(value: "latest" | "oldest") => setSortBy(value)}
          >
            <SelectTrigger className="w-27.5 h-11 rounded-md cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
         

          <Badge
            variant={showTopOnly ? "secondary" : "outline"}
            className={cn(
              "cursor-pointer transition-all  px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 text-sm",
              showTopOnly ? "shadow-sm bg-primary text-primary-foreground" : "hover:bg-muted/50"
            )}
            onClick={() => {
              setShowTopOnly(!showTopOnly);
              setSelectedTag(null);
            }}
          >
            <Trophy className="h-4 w-4" />
            Top 3
          </Badge>
        </div>

        {/* Right: all + Tags */}
        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
           <Badge
            variant={selectedTag === null && !showTopOnly ? "secondary" : "outline"}
            className={cn(
              "cursor-pointer transition-all  px-3 py-1 rounded-full font-normal text-sm",
              selectedTag === null && !showTopOnly ? "shadow-sm" : "hover:bg-muted/50"
            )}
            onClick={() => {
              setSelectedTag(null);
              setShowTopOnly(false);
            }}
          >
            All
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "secondary" : "outline"}
              className={cn(
                "cursor-pointer transition-all  px-3 py-1 rounded-full font-normal text-sm",
                selectedTag === tag ? "shadow-sm" : "hover:bg-muted/50"
              )}
              onClick={() => {
                setSelectedTag(tag);
                setShowTopOnly(false);
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;
