'use client';
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useEffect } from 'react';
import  {useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "../context/AuthProvider";
import "./globals.css";
import { ThemeProvider } from "styled-components";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
const inter = Inter({ subsets: ["latin"] });




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const theme = {
  colors: {
    default:
      "white",
    primaryText: "white",
    overlay: "black",
    defaultText: "white",

  },

};



  return (
    <html lang="en">
      <body className={inter.className}>
         
         <Toaster position="bottom-center" />
         <ThemeProvider theme={theme}>
        <AuthProvider>
           <NextTopLoader color='#008ED3' showSpinner={true} />
        {children}
        </AuthProvider>
        </ThemeProvider>
        </body>
    </html>
  );
}
