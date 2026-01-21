import React from "react";
import { Skeleton } from "../ui/skeleton";

function CardSkeleton() {
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-card rounded-md overflow-hidden p-1 shadow">
          {/* Image */}
          <Skeleton className="h-40 sm:h-48 w-full rounded-md" />

          {/* Content */}
          <div className="p-3 sm:p-4 space-y-3">
            {/* Avatar + Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="size-8 sm:size-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-14 rounded-sm" />
              <Skeleton className="h-5 w-16 rounded-sm" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 py-2.5 border-t flex justify-around">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      ))}
    </>
  );
}

export default CardSkeleton;