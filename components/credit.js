"use client"
import React from 'react'

import { useEffect, useState ,useRef } from 'react'
import { fetchCredit } from '@/fetch/credit'
const Credit = ({movie}) => {
    const castRef = useRef(null);
        const scrollLeft = () => {
      castRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    };
    
    const scrollRight = () => {
      castRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    };
     const[credits,setCredits] =useState(null)
       const [director, setDirector] = useState("")
     useEffect(() => {
  if (!movie) return;

  fetchCredit(movie, "tv").then(setCredits).catch((e)=>console.error(e));
    
  // Fetch average rating for this title (reviews API uses numeric id)

}, [movie]);

console.log(credits)
  return (
    <div>  <div
    ref={castRef} 
    className="flex   gap-4 sm:gap-6 overflow-x-auto py-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
{credits?.crew?.slice(0, 10).map((m) => (
      <div
        key={m.id}
        className="flex-shrink-0 w-24 sm:w-32 md:w-36 hover:scale-105 transition"
      >
    

        <p className="mt-2 text-[10px] sm:text-xs font-semibold text-center text-white truncate">
          {m.name}
        </p>
         <p className="mt-2 text-[10px] sm:text-xs font-semibold text-center text-white truncate">
          {m.department}
        </p>
      </div>
    ))}
  </div>
</div>
  )
}

export default Credit