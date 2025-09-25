import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Home() {
  return (
   <div className="flex flex-col items-center  w-full h-screen">
    <div className="my-16">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
     ProjectFolio
    </h1>
    <p className="leading-7 [&:not(:first-child)]:mt-6  text-2xl">Showcasing Ideas, Building Futures.</p>
    </div>
    

      <div className="mt-7 flex flex-col gap-10 items-center">
        <h1 className="text-2xl font-medium">Projects</h1>
          <div className="flex gap-25">

           <Link href='/projects/javascript'>

           <Card className="w-[350px] h-[300px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image2.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>Javascript Projects</CardTitle>
  </CardFooter>
</Card>

</Link>
           
              

            <Link href='/projects/react'>

           <Card className="w-[350px] h-[300px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image1.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>React Projects</CardTitle>
  </CardFooter>
</Card>

</Link>

             


            <Link href='/projects/nextjs'>

           <Card className="w-[350px] h-[300px] flex flex-col  hover:scale-105 transition">
  <CardContent className="flex-1 flex items-center justify-center">
    <Image src="/image3.png" alt="" width={350} height={250} />
  </CardContent>
  <CardFooter className="flex flex-col items-center">
    <CardTitle>Nextjs Projects</CardTitle>
  </CardFooter>
</Card>

</Link>

          </div>
      </div>

   </div>
  );
}





