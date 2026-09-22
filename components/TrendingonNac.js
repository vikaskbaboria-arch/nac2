"use client"
import React, { useEffect, useState } from "react"
import { fetchMovies } from "@/lib/masterfetch"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter } from "next/navigation"

/**
 * Same source as the original Trending component (trending/day/all), just
 * rendered as a single scrollable row instead of a wrapping grid — a grid
 * can't stay one row at every breakpoint, a scroll strip always does.
 */
const TrendingOnNAC = ({
  fetchParams = { type: "trending", time: "day", type_of: "all" },
}) => {
  const [movies, setMovies] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchMovies(fetchParams).then((m) => setMovies(m.results))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchParams.type, fetchParams.type_of, fetchParams.time])

  const handleClick = (m) => {
    if (m.media_type === "movie" || fetchParams.type_of === "movie") {
      router.push(`/movie/${m.id}?type=movie`)
    } else {
      router.push(`/movie/${m.id}?type=tv`)
    }
  }

  return (
    <section className="w-full">
      <h2 className="font-display text-white text-2xl sm:text-3xl mb-3 px-1">
        Trending on NAC
      </h2>

      <div
        className="
          relative flex
          w-full
          gap-4
          p-3
          rounded-xl
        
          overflow-x-auto
          snap-x snap-mandatory
          scroll-px-3
        "
      >
        {movies?.slice(0, 5).map((m) => (
          <div
            key={m.id}
            onClick={() => handleClick(m)}
            className="
              group
              cursor-pointer
              shrink-0
              snap-start
              w-[38vw] xs:w-[30vw]
              sm:w-[22vw]
              lg:w-[160px]
              rounded-xl
              p-2
              transition-colors
              hover:bg-white/10
            "
          >
            {/* POSTER */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-poster">
              <img
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                    : "/placeholder.png"
                }
                className="
                  absolute inset-0
                  w-full h-full object-cover
                  rounded-xl
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
            <div className="text-muted-foreground text-xs tracking-wide">
              <AnimatedShinyText>
                {(m.media_type ?? fetchParams.type_of) === "movie" ? "Movie" : "Series"}
              </AnimatedShinyText>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrendingOnNAC