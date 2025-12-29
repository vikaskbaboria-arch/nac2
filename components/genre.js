"use client"
import React, { useEffect, useState } from 'react'
import { fetchMovies } from '@/lib/masterfetch'
import { useRouter, useSearchParams } from "next/navigation";
const Genre = ({no}) => {
      const searchParams = useSearchParams();
    const router =useRouter()
      const pageFromUrl = Number(searchParams.get("page")) || 1;
    const[movie,setMovie]=useState(null)
    const[page,setPage]=useState(pageFromUrl)
const num =no
// console.log(num)
useEffect(()=>{
  fetchMovies({genre:num,page:page}).
  then((m)=>setMovie(m))
},[movie,page])
const totalpages = movie?.total_pages;
// console.log(movie)
const handleClick=((m)=>{
    router.push('/movie/'+m.title)
})
  return (
      <div className="w-full min-h-[89vh] px-4 sm:px-8 py-8">
      {movie?.results?.map((m) => (
        <div
        
          key={m.id}
          onClick={() => handleClick(m)}
          className="
            cursor-pointer
            flex flex-col md:flex-row
            gap-6 md:gap-10
            items-start
            bg-gray-900/40
            hover:bg-gray-900/70
            transition rounded-xl
            p-4 sm:p-6
            my-6
          "
        >
          {/* Poster */}
         {/* Poster */}
<div
  className="
    w-full
    sm:w-23
    md:w-34
    lg:w-12
    xl:w-34
    flex-shrink-0
  "
>
  <img
    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
    alt="movie poster"
    className="
      w-full
      aspect-[2/3]
      object-cover
      rounded-lg
    "
  />
</div>


          {/* Movie Data */}
          <div className="text-white w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              {m.title}
            </h2>

            <p className="text-slate-400 font-semibold mb-2">
              Overview
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-slate-200">
              {m.overview}
            </p>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className={ `${totalpages>1?"":"hidden"} flex items-center justify-center gap-6 mt-8 text-white`}>
        <span>{page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition"
        >
          Next
        </button>
        <span>{totalpages}</span>
      </div>
    </div>
  )
}

export default Genre