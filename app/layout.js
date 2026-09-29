import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/starfield";
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
      <body className="bg-[#020000] min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-0">
               {/* <Starfield /> */}
     <Sessionwrapper>
      <div className="mb-16">        <Navbar/></div>

  
        {children }
        </Sessionwrapper>
        <div className="mt-6"><Footer/></div>
           
      </body>
    </html>
  );
}
