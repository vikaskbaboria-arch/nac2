"use client"
import React, { useEffect, useState } from 'react'
import { fetchMovies } from '@/lib/masterfetch'
import { useRouter, useSearchParams } from "next/navigation";
const Genre = ({no,type}) => {
      const searchParams = useSearchParams();
      const [showFullOverview, setShowFullOverview] = useState(false);
    const router =useRouter()
      const pageFromUrl = Number(searchParams.get("page")) || 1;
    const[movie,setMovie]=useState(null)
    const[page,setPage]=useState(pageFromUrl)
const num =no
const typeo = type

// console.log(num)
useEffect(()=>{
  fetchMovies({type_of:typeo,genre:num,page:page}).
  then((m)=>setMovie(m))
},[movie,page])
const totalpages = movie?.total_pages;
// console.log(movie)
const handleClick=((m)=>{
    router.push('/movie/'+m.id)
})
  return (
      <div className="w-full min-h-[89vh] px-4 sm:px-8 py-8">
      {movie?.results?.map((m) => (
        <div
        
          key={m.id}
          onClick={() => handleClick(m)}
          className="
            cursor-pointer
            flex  md:flex-row
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
    w-28
    sm:w-33
    md:w-36
    lg:w-42
    xl:w-44
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

          <div className="over flex flex-col gap-3">

  <span className="text-slate-400 font-bold">
    Overview
  </span>

  {/* OVERVIEW TEXT */}
  <p
    className={`
         text-gray-200 leading-relaxed
      ${showFullOverview ? "" : "line-clamp-3"}
      md:line-clamp-none text-xs sm:text-md
      transition-all duration-300
    `}
  >
    {m?.overview}
  </p>

  {/* TOGGLE BUTTON (ONLY MOBILE) */}
  {m?.overview?.length > 100 && (
    <button
      onClick={() => setShowFullOverview(!showFullOverview)}
      className="md:hidden text-purple-400 text-sm font-semibold self-start"
    >
      {showFullOverview ? "Show less" : "Show more"}
    </button>
  )}

</div>

           
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