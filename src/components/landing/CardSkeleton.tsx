import React from 'react'
import { Skeleton } from '../ui/skeleton'

function CardSkeleton() {
  return (
    <>
    
    {
        
    Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 bg-white p-4 rounded-2xl shadow">
                  <Skeleton className="h-[125px] w-full rounded-xl bg-gray-300 dark:bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-[80%] bg-gray-300 dark:bg-gray-700" />
                  </div>
                </div>
              ))
              
            }

            </>
  )
}

export default CardSkeleton