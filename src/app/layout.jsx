'use client';
import "./globals.css";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { ReduxProvider } from "@/components/Providers/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <ReduxProvider>
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
