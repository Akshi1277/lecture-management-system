'use client';
import "./globals.css";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { Outfit } from "next/font/google";
import { usePathname } from "next/navigation";
import { ReduxProvider } from "@/components/Providers/ReduxProvider";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit'
});

import { useState, useEffect } from "react";
import UniversalLoader from "@/components/Shared/UniversalLoader";
import { AnimatePresence } from "framer-motion";

export default function RootLayout({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Artificial delay to ensure a smooth transition
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen flex flex-col bg-slate-950 antialiased`}>
        <ReduxProvider>
          <AnimatePresence>
            {!isLoaded && <UniversalLoader />}
          </AnimatePresence>
          <ConditionalNavbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </ReduxProvider>
      </body>
    </html>
  );
}

function ConditionalNavbar() {
  const navpathName = usePathname();
  // Hide navbar on auth and dashboard pages
  if (
    navpathName === '/login' ||
    navpathName === '/demo' ||
    navpathName.startsWith('/dashboard')
  ) {
    return null;
  }
  return <Navbar />
}

function ConditionalFooter() {
  const footerpathName = usePathname();
  // Hide footer on auth and dashboard pages
  if (
    footerpathName === '/login' ||
    footerpathName === '/demo' ||
    footerpathName.startsWith('/dashboard')
  ) {
    return null;
  }
  return <Footer />
}
