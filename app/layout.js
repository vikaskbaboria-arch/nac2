import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sessionwrapper from "@/components/sessionwrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NAC - Not a Critic",
  description: "A platform to find movies for your next watch.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br to-gray-950 via-black  from-purple-950  min-h-screen select-none ">
     <Sessionwrapper>
        <Navbar/>
        {children}
        </Sessionwrapper>
      </body>
    </html>
  );
}
