import Image from "next/image";
import Link from "next/link";



export default function Home() {
  return (
   <div className="flex flex-col items-center  w-full h-screen">
    <div className="my-20">
        <h1 className="font-bold text-4xl">
        projectfolio
      </h1>
    </div>
    

      <div className="mt-20 flex flex-col gap-10 items-center">
        <h1 className="text-2xl font-medium">Projects</h1>
          <div className="flex gap-25">

            <Link href='/projects/javascript'>
             <div className="flex flex-col items-center">
              <Image src="/image1.png" alt="" width={350} height={250}/>
              <h2>javascript projects</h2>
            </div>
            </Link>
           
              <Link href='/projects/react'>
              
            <div className="flex flex-col items-center">
              <Image src="/image2.png" alt="" width={350} height={250}/>
              <h2>React projects</h2>
            </div>

            </Link>

               <Link href='/projects/nextjs'>
            <div className="flex flex-col items-center">
              <Image src="/image3.png" alt="" width={350} height={250}/>
              <h2>nextjs projects</h2>
            </div>
            </Link>

          </div>
      </div>

   </div>
  );
}
