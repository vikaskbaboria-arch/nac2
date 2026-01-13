"use client"
import React, { useEffect, useState } from 'react'
import { fetchMovies } from '@/lib/masterfetch'
import { m } from 'framer-motion'
const Trending = () => {
    const [movies,setMovies]=useState(null)
    const url =`https://image.tmdb.org/t/p/w500/`
    useEffect(()=>{
        fetchMovies({type:'trending',
            time:'day',
            type_of:'all'
        }).then((m)=>(setMovies(m.results)))
    },[])
    console.log(movies)
  return (
    <div className='text-amber-50  w-[1080px] h-[750px] grid py-10 gap-4 grid-rows-2 grid-cols-5 p-2'>
    {movies?.slice(0,10).map((m)=>{
        return(
<div key={m.id} className='
transition-all duration-200 
 p-4
hover:bg-slate-900 rounded-md flex flex-col  items-center  '>
         <img
          src={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : '/placeholder.png'} width={342}
          className=" rounded-md"
          alt={m.title}
        />
 
<div className="w-[160px] overflow-hidden group">
  <div
    className={`
      whitespace-nowrap
      text-center 
      ${m?.title?.length > 20 ? "marquee" : ""  || m?.name?.length > 20 ? "marquee" : "" }
    `}
  >
    {m?.title || m.name}
  </div>
</div>

        <div>{m.media_type}</div>
         </div>
        )
    })}
    
 


    </div>
  )
}

export default Trending