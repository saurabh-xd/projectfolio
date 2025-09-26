import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

function Javascript() {
  return (
    <div className='flex items-center flex-col '>

      <div className='p-12'>
       <h1>Javascript Projects</h1>
      </div>
     

      <div className='flex justify-center gap-16 flex-wrap mb-4'>
        
        <Card className="w-[300px] h-[250px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image2.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>Javascript Projects</CardTitle>
  </CardFooter>
</Card>
       
         <Card className="w-[300px] h-[250px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image2.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>Javascript Projects</CardTitle>
  </CardFooter>
</Card>
        
         <Card className="w-[300px] h-[250px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image2.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>Javascript Projects</CardTitle>
  </CardFooter>
</Card>
       
        <Card className="w-[300px] h-[250px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image2.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>Javascript Projects</CardTitle>
  </CardFooter>
</Card>
       
        <Card className="w-[300px] h-[250px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image2.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>Javascript Projects</CardTitle>
  </CardFooter>
</Card>
        
         <Card className="w-[300px] h-[250px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image2.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>Javascript Projects</CardTitle>
  </CardFooter>
</Card>
      </div>
    </div>
  )
}

export default Javascript