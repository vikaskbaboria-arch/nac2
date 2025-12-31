"use client";
import React, { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/masterfetch";
import { useRouter, useSearchParams } from "next/navigation";

const Search = ({ movie }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
const [showFullOverview, setShowFullOverview] = useState(false);
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [movies, setMovies] = useState(null);
  const [pages, setPages] = useState(pageFromUrl);

  useEffect(() => {
    fetchMovies({
      type: "search",
      query: movie,
      type_of:"multi",
      page: pages,
    }).then((m) => setMovies(m));
  }, [movie, pages]);
// console.log(movie)
  const totalpages = movies?.total_pages;

  const handleClick = (m) => {
    if(m.media_type==="movie"){
    router.push(`/movie/${m?.id}`);}
   else{
    router.push(`/series/${m.id}`);
   }
  };


  useEffect(() => {
    router.push(`?page=${pages}`, { scroll: true });
  }, [pages]);
// console.log(movies?.results)

  return (
    <div className="w-full min-h-[89vh] px-4 sm:px-8 py-8">
      {movies?.results?.map((m) => (
        <div
          key={m.id}
          onClick={() => handleClick(m)}
          className="
            cursor-pointer
            flex  md:flex-row
            sm:w-full
            text-md sm:text-lg
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
    src={`https://image.tmdb.org/t/p/w500${m.profile_path} || https://image.tmdb.org/t/p/w500${m.poster_path}`}
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
              {m.title || m.name}
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
           
             <div className="text-white mt-16 ">
            {m.media_type==="tv"?"Tv":m.media_type==="movie"?"Movie":"Person"}
          </div>
        
          </div>
          <div className=" top-6 px-2 w-24 font-bold h-7 text-center flex items-center right-8 bg-green-700 text-white px-2 rounded">⭐{m?.vote_average} </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-6 mt-8 text-white">
        <span>{pages}</span>
        <button
          onClick={() => setPages(pages + 1)}
          className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition"
        >
          Next
        </button>
        <span>{totalpages}</span>
      </div>
    </div>
  );
};

export default Search;
