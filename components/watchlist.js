"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react'
const Watchlist = ({ movieId }) => {
  const [watchlist, setWatchlist] = useState(" Watch Later");
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
      <div className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white transition hover:bg-white/10 w-40 " >
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
