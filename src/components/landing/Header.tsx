import { Search, Trophy, X } from "lucide-react";
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
    <div className=" mb-8 space-y-8">
      {/* //title */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Explore <span className="text-primary">Projects</span>
        </h1>

        <p className="text-muted-foreground max-w-xl mx-auto px-2">
          Showcase your projects and discover inspiring ones
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-16 px-4">
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
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        <Select
          value={sortBy}
          onValueChange={(value: "latest" | "oldest") => setSortBy(value)}
        >
          <SelectTrigger className="w-30 h-9 text-base font-mono cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ Filter Bar: Tags + Sort */}
        <div className="px-4  space-y-4">
          {/* Tag Pills */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* All Button */}
            <Badge
              variant={
                selectedTag === null && !showTopOnly ? "secondary" : "outline"
              }
              className={cn(
                "cursor-pointer transition-all hover:scale-105 px-4 py-2 rounded-3xl font-bold",
                selectedTag === null && !showTopOnly && "shadow-md"
              )}
              onClick={() => {
                setSelectedTag(null);
                setShowTopOnly(false);
              }}
            >
              All
            </Badge>

            {/* Top 3 Button */}
            <Badge
              variant={showTopOnly ? "secondary" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105 px-4 py-2 rounded-3xl font-bold flex items-center gap-1.5",
                showTopOnly && "shadow-md bg-primary text-white border-0 "
              )}
              onClick={() => {
                setShowTopOnly(!showTopOnly);
                setSelectedTag(null);
              }}
            >
              <Trophy className="size-3" />
              Top 3
            </Badge>

            {/* Tag Buttons */}
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "secondary" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105 px-4 py-2 rounded-3xl font-bold",
                  selectedTag === tag && "shadow-md"
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
    </div>
  );
}

export default Header;
