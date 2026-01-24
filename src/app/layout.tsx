
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Providers } from "@/components/common/providers";
import { Poppins } from "next/font/google"
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // choose weights you need
})

export const metadata: Metadata = {
  metadataBase: new URL("https://projectfolio.vercel.app"),

  title: {
    default: "ProjectFolio",
    template: "%s | ProjectFolio",
  },

  description:
    "ProjectFolio is a social platform where developers showcase projects, discover inspiring work, and connect with builders.",

  openGraph: {
    title: "ProjectFolio – Discover & Showcase Developer Projects",
    description:
      "Explore real-world projects built by developers. Like, bookmark, and discover inspiring work on ProjectFolio.",
    url: "https://projectfolio.vercel.app",
    siteName: "ProjectFolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ProjectFolio – Developer Project Showcase",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ProjectFolio – Developer Project Showcase",
    description:
      "Showcase your projects, explore others’ work, and get inspired on ProjectFolio.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${poppins.className}` }
      >
     
        <Providers>
        <Navbar/>
        
        {children}
            <Analytics />

        <Footer/>

        </Providers>
       
       
      </body>
    </html>
  );
}
