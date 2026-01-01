"use client"
import React from 'react'
import { useState, useEffect,useRef } from 'react'

import { useRouter } from 'next/navigation'
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { fetchgenere,generename , getGenreNames} from '@/fetch/genre'

const Series = (genere) => {
    const movieRef = useRef(null);
   
   const scrollLeft = () => {
     movieRef.current?.scrollBy({ left: -1100, behavior: "smooth" });
   };
   
   const scrollRight = () => {
     movieRef.current?.scrollBy({ left: 1100, behavior: "smooth" });
   };

   const [movie,setMovie]=useState(null)
  const [ratingsMap, setRatingsMap] = useState({});
 const router =useRouter()
   const [names,setNames]=useState(null)
useEffect(() => {
 fetchgenere(genere.movie,"tv")
 .then((m)=>(setMovie(m)))
    
 
}, [genere])

// fetch ratings for visible items

 
// console.log(movie)

useEffect(() => {
 generename({type:"tv"})

    
 
}, [genere])
useEffect(() => {
  getGenreNames(genere.movie).
  then((m)=>(setNames(m)))

}
  ,[genere])
// console.log(genre?.genres)

// function getGenreNames(genreIds) {
//   genre?.genres.forEach(element => {
     
//     //  element.id===genreIds && console.log(element.name)
//     if(element.id===genreIds){ 
//       console.log(element.name)
      
//       return element.name
//     }
//   });
// }


// function getGenreNames(genreIds) {
//   const genreNames = genre?
//     .filter((genre) => genreIds.includes(genre.id))
//     .map((genre) => genre.name);
//   return genreNames;
// }
// const genreNames = getGenreNames(28)
const handleLink=(movie)=>{
   router.push(`/series/${movie.id}`)
   
}
const handlejust=(m)=>{
  router.push(`tv/genre/${m}`)
}
console.log(movie)
  return (
    <>
    
    <div className='my-1 sm:my-8  mx-auto [92vw] h-52 sm:h-80    '>
      <div className='flex items-center justify-between ' >
       <div className='text-white font-bold mx-3 sm:mx-2    text-lg sm:text-3xl'>{names}</div>
       <div className='text-white mr-6 text-xs sm:text-xl   flex items-center   gap-2' onClick={()=>handlejust(genere.movie)}> <InteractiveHoverButton>More</InteractiveHoverButton></div>
      </div>
      
     
      <div className="relative ">

  {/* LEFT BUTTON */}
  <button
    onClick={scrollLeft}
    className="
      absolute left-0 top-1/2 -translate-y-1/2 z-10
      w-18 h-60 
      bg-black/70 hover:bg-black/80
      text-white flex items-center justify-center
      hidden sm:flex
    "
  >
    <img src="./left.svg" alt="" />
  </button>

  {/* MOVIE SCROLL AREA */}
  <div
    ref={movieRef}
    className="
      snap-x flex overflow-x-auto overflow-y-hidden
      gap-5 h-40 sm:h-50  items-center sm:h-70 sm:gap-6
      [-ms-overflow-style:none]
      [scrollbar-width:none]
      [&::-webkit-scrollbar]:hidden
    "
  >
    {movie?.results?.map((m) => (
      <div
        key={m.id}
        onClick={() => handleLink(m)}
        className="
          snap-center flex-shrink-0
          h-38 rounded-md relative
          transition-transform duration-300 hover:scale-105
          cursor-pointer
          w-24 sm:w-40
          sm:h-60
        "
      >
        <img
          src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '/placeholder.png'}
          className="h-full rounded-md object-cover"
          alt={m.title}
        />

        <span className="absolute top-2 right-1 text-xs bg-green-700 px-0.5 py-0.5 rounded text-white font-bold sm:right-3 ">
          {m?.vote_average}
        </span>
      </div>
    ))}
  </div>

  {/* RIGHT BUTTON */}
  <button
    onClick={scrollRight}
    className="
      absolute right-0 top-1/2 -translate-y-1/2 z-10
      w-18 h-60
      bg-black/70 hover:bg-black/80
      text-white flex items-center justify-center
      hidden sm:flex
    "
  >
  <img src="./right.svg" alt="" />
  </button>

</div>

    </div>




    
    </>
  )
}

export default Series
