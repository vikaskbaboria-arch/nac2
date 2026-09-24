"use client"
import React, { useEffect, useState } from "react"
import { fetchMovies } from "@/lib/masterfetch"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter } from "next/navigation"

const Trending = () => {
  const [movies, setMovies] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchMovies({
      type: "trending",
      time: "day",
      type_of: "all",
    }).then((m) => setMovies(m.results))
  }, [])

  const handleClick = (m) => {
    if (m.media_type === "movie") {
      router.push(`/movie/${m.id}?type=movie`)
    } else {
      router.push(`/movie/${m.id}?type=tv`)
    }
  }

  return (
    <section className="w-full">
      <h2 className="font-display font-bold text-slate-300 text-xl sm:text-2xl mb-2 px-6">
        Trending on NAC
      </h2>
    <div
      className="
        relative grid
        w-full max-w-[1080px]
        gap-4
       
        p-3
  
        
        
     

        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-5
      "
    >
     
      {movies?.slice(0, 10).map((m) => (
        <div
          key={m.id}
          onClick={() => handleClick(m)}
          className="
            group
            cursor-pointer
            w-[calc(100%+0.75rem)]
            rounded-xl
            p-2
            transition-colors
            hover:bg-white/10
          "
        >
          {/* POSTER */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <img
              src={
                m.poster_path
                  ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                  : "/placeholder.png"
              }
              className="
                absolute inset-0
                w-full h-full object-cover
               
              "
              alt={m.title || m.name}
            />

            {/* subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
          </div>

          {/* TITLE */}
          <div className="mt-2 text-sm font-semibold overflow-hidden">
            <div
              className={`
                whitespace-nowrap
                ${(m?.title?.length > 22 || m?.name?.length > 22)
                  ? "marquee"
                  : ""}
              `}
            >
              <AnimatedShinyText>
                {m?.title || m?.name}
              </AnimatedShinyText>
            </div>
          </div>

          {/* MEDIA TYPE */}
          <div className="text-white/60 text-xs tracking-wide">
            <AnimatedShinyText>
              {m.media_type === "movie" ? "Movie" : "Series"}
            </AnimatedShinyText>
          </div>
        </div>
      ))}
    </div>
    </section>
  )
}

export default Trending
