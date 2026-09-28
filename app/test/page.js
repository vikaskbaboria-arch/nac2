"use client"
import React, { useEffect, useState } from 'react'
import { fetchMovies } from '@/lib/masterfetch'
import { m } from 'framer-motion'
import { SearchGridSkeleton } from '@/components/skeletons/HomeSectionSkeletons'
const Trending = () => {
    const [movies,setMovies]=useState(null)
    const url =`https://image.tmdb.org/t/p/w500/`
    useEffect(()=>{
        fetchMovies({type:'trending',
            time:'day',
            type_of:'all'
        })
          .then((m)=>(setMovies(m?.results ?? [])))
          .catch((error) => {
            console.error("Failed to load test trending titles:", error)
            setMovies([])
          })
    },[])
    console.log(movies)
  if (movies === null) return <SearchGridSkeleton count={10} />
  return (
    <div className='grid min-h-[50vh] w-full max-w-6xl grid-cols-2 gap-4 px-4 py-10 text-amber-50 sm:grid-cols-3 lg:grid-cols-5'>
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