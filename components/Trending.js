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
      router.push(`/movie/${m.id}`)
    } else {
      router.push(`/series/${m.id}`)
    }
  }

  return (
    <div
      className="
        relative grid
        w-full max-w-[1080px]
        gap-3
       
        p-3
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
        border border-white/10 rounded-2xl
        bg-gradient-to-b from-black/60 to-black/30
        backdrop-blur-2xl

        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
      "
    >
      {movies?.slice(0, 8).map((m) => (
        <div
          key={m.id}
          onClick={() => handleClick(m)}
          className="
            group
            cursor-pointer
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
                transition-transform duration-300
                group-hover:scale-105
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
  )
}

export default Trending
