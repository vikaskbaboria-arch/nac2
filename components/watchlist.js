"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react'
const Watchlist = ({ movieId }) => {
  const [watchlist, setWatchlist] = useState("Add to Watch");
 const { data: session, status } = useSession();
 const [logpop,setLogpop]=useState(false)
  const handleSubmit = async () => {
    if (!session) {
       setLogpop(!logpop)
       return
    };
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieid:movieId }),
    });

    if (!response.ok) {
      console.error("Not able to add");
      return;
    }

    setWatchlist("already");
  };

  return (

    <div className="absolute" >
      <div className="absolute bg-purple-500 flex hover:bg-purple-900 justify-center items-center rounded-xl text-lg text-white/80  w-68 h-12 " >
      <button onClick={handleSubmit} >{watchlist}</button>
    </div>
       {logpop && (
  <div
  className={`
    absolute -top-20 w-60 h-40
    bg-red-500 text-white p-4 rounded-lg
    transition-all duration-300 ease-out
    ${logpop
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-3 scale-95 pointer-events-none"}
  `}
>
  Login
  <button >            <Link href="/login" className="hover:text-purple-400 transition">Login</Link></button>
</div>

)}  
    </div>
    
  );
};

export default Watchlist;
