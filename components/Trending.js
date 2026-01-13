"use client"
import React, { useEffect, useState } from "react"
import { fetchMovies } from "@/lib/masterfetch"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter, useSearchParams } from "next/navigation";
const Trending = () => {
  const [movies, setMovies] = useState(null)
  const router = useRouter();
  useEffect(() => {
    fetchMovies({
      type: "trending",
      time: "day",
      type_of: "all",
    }).then((m) => setMovies(m.results))
  }, [])
  const handleClick = (m) => {
    if(m.media_type==="movie"){
    router.push(`/movie/${m?.id}`);}
   else{
    router.push(`/series/${m.id}`);
   }
  };
  return (
    <div
      className="
  relative grid
w-full max-w-[1080px]
gap-1 md:gap-2
p-2
shadow-[0_0_40px_rgba(0,0,0,0.6)]
border border-white/10 rounded-2xl
bg-gradient-to-b from-black/60 to-black/30
backdrop-blur-2xl

grid-cols-3
    grid-rows-2

    md:grid-cols-3
    md:grid-rows-3
    md:h-[671px]
    md:overflow-y-auto

    lg:grid-cols-5
    lg:grid-rows-2



      "
    >
      {movies?.slice(0, 10).map((m) => (
        <div
          key={m.id}
          className="
            group
            rounded-lg
            flex flex-col
            px-2 py-2
            gap-2
            hover:bg-white/10
        
           
            cursor-pointer
          " onClick={()=>handleClick(m)}
        >
          <div className="overflow-hidden rounded-md">
            <img
              src={
                m.poster_path
                  ? `https://image.tmdb.org/t/p/w185${m.poster_path}`
                  : "/placeholder.png"
              }
              width={185}
              className="
                w-full h-auto object-cover
                rounded-md
                group-hover:scale-[1.04]
                transition-transform duration-300
              "
              alt={m.title || m.name}
            />
          </div>

          {/* Title */}
          <div className="w-full text-sm md:text-base font-semibold overflow-hidden">
            <div
              className={`
                whitespace-nowrap
                ${(m?.title?.length > 20 || m?.name?.length > 20) ? "marquee" : ""}
              `}
            >
              <AnimatedShinyText>
                {m?.title || m?.name}
              </AnimatedShinyText>
            </div>
          </div>

          {/* Media Type */}
          <div className="text-white/60 text-xs md:text-sm tracking-wide">
            <AnimatedShinyText>
              {m?.media_type === "movie" ? "Movie" : "Series"}
            </AnimatedShinyText>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Trending
