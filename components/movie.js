"use client"
import React from 'react'
import { useState, useEffect,useRef } from 'react'

import { useRouter } from 'next/navigation'
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { fetchgenere,generename , getGenreNames} from '@/fetch/genre'

const Movie = (genere) => {
    const movieRef = useRef(null);
   
   const scrollLeft = () => {
     movieRef.current?.scrollBy({ left: -1100, behavior: "smooth" });
   };
   
   const scrollRight = () => {
     movieRef.current?.scrollBy({ left: 1100, behavior: "smooth" });
   };

   const [movie,setMovie]=useState(null)

 const router =useRouter()
   const [names,setNames]=useState(null)
useEffect(() => {
 fetchgenere(genere.movie,"movie")
 .then((m)=>(setMovie(m)))
    
 
}, [genere])


 
// console.log(movie)

useEffect(() => {
 generename({type:"movie"})

    
 
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
   router.push(`/movie/${movie.id}`)
   
}
const handlejust=(m)=>{
  router.push(`/genre/${m}`)
}
const [button,setButton]=useState(false)
const mouseenter=()=>{
    setButton(()=>(!button))
}
console.log(movie)
  return (
    <>
    
    <div className='my-1 sm:my-8  mx-auto [92vw] h-52 sm:h-80     '    onMouseEnter={() => setButton(true)}
  onMouseLeave={() => setButton(false)}>
      <div className='flex items-center justify-between ' >
       <div className='text-white font-bold mx-3 sm:mx-2    text-lg sm:text-3xl'>{names}</div>
       <div className='text-white mr-6 text-xs sm:text-xl   flex items-center   gap-2' onClick={()=>handlejust(genere.movie)}> <InteractiveHoverButton>More</InteractiveHoverButton></div>
      </div>
      
     
      <div className="relative ">

  {/* LEFT BUTTON */}
  <button
    onClick={scrollLeft}
    className={`
      absolute left-0 top-1/2 -translate-y-1/2 z-10
      w-18 h-60 
      bg-black/70 hover:bg-black/80
      text-white flex items-center justify-center
      hidden  hidden ${button?"sm:flex":""}
    `}
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
    className={`
      absolute right-0 top-1/2 -translate-y-1/2 z-10
      w-18 h-60
      bg-black/70 hover:bg-black/80
      text-white flex items-center justify-center
      hidden ${button?"sm:flex":""}
    `}
  >
  <img src="./right.svg" alt="" />
  </button>

</div>

    </div>




    
    </>
  )
}

export default Movie


// "use client";
// import React, { useEffect, useState } from "react";
// import { fetchgenere, getGenreNames } from "@/api/genre";

// const Movie = ({ movie }) => {
//   const [movies, setMovies] = useState(null);
//   const [name, setName] = useState("");

//   // Fetch movies for THIS genre
//   useEffect(() => {
//     fetchgenere(movie).then(setMovies);
//   }, [movie]);

//   // Fetch genre name for THIS genre
//   useEffect(() => {
//     getGenreNames(movie).then(setName);
//   }, [movie]);

//   return (
//     <div className="my-6 mx-auto   w-[89vw] rounded">
      
//       {/* GENRE TITLE */}
//       <div className="text-white  font-bold m-5 pt-4 text-4xl">
//         {name}
//       </div>

//       {/* MOVIES */}
//       <div className="overflow-x-auto  flex px-4 pb-4 pt-2 gap-6">
//         {movies?.results?.map((m) => (
//           <div
//             key={m.id}
//             className="bg-amber-500 h-80 w-60 rounded-md relative flex-shrink-0"
//           >
//             <img
//               src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
//               className="rounded-md"
//               alt={m.title}
//             />
//             <div className="absolute bottom-0 text-white px-2 pb-2">
//               <span className="font-bold text-sm">{m.title}</span>
//               <span className="text-xs block">
//                 ⭐ {m.vote_average}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Movie;


// export default Movie;

