'use client';
import "./globals.css";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <ConditionalNavbar/>
        <main className="flex-1">{children}</main>
       <ConditionalFooter/>
      </body>
    </html>
  );
}

function ConditionalNavbar(){

  const navpathName = usePathname();

  if(navpathName==='/login' || navpathName==='/register'){
    return null;
  }
  return <Navbar/>
}

function ConditionalFooter(){
  const footerpathName= usePathname();

  if(footerpathName==='/login' || footerpathName==='/register'){
    return null;
  }
  return <Footer/>
}
