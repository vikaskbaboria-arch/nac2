"use client"
import React, { useEffect, useState } from 'react'
import { fetchMovies } from '@/lib/masterfetch'
const Watchcomp = ({movieid}) => {

    const [movie,setMovie]=useState(null)
  useEffect(()=>{
   fetchMovies({
    type: "byid",
      id: movieid,
      type_of: "movie",
   }).then((m)=>setMovie(m))
  },[movieid])
  console.log(movie)
  return (
    <div>
      {movie?.title}
    </div>
  )
}

export default Watchcomp