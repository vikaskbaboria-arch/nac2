"use client"
import React, { useEffect, useState } from "react"
import { fetchMovies } from "@/lib/masterfetch"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter } from "next/navigation"

/**
 * The aggregate endpoint now returns each title's stored `type`
 * ("movie" | "series"), so we no longer have to guess — map it to the
 * "movie"/"tv" values fetchMovies expects.
 */
const MostInterested = ({ limit = 10 }) => {
  const [movies, setMovies] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    fetch(`/api/intrested/top?limit=${limit}`)
      .then((res) => res.json())
      .then(async (data) => {
        const top = data?.top || []
        const results = await Promise.all(
          top.map((t) =>
            fetchMovies({
              type: "byid",
              id: t.movieid,
              type_of: t.type === "series" ? "tv" : "movie",
            })
              .then((m) => ({ ...m, interestedCount: t.count, interestedType: t.type }))
              .catch(() => null)
          )
        )
        if (mounted) setMovies(results.filter(Boolean))
      })
      .catch(() => mounted && setMovies([]))

    return () => {
      mounted = false
    }
  }, [limit])

  const handleClick = (m) => {
    router.push(`/movie/${m.id}?type=${m.interestedType === "series" ? "tv" : "movie"}`)
  }

  return (
    <section className="w-full bg-black">
      <h2 className="font-display text-white text-2xl sm:text-3xl mb-3 px-1">
        Most Interested
      </h2>

      <div
        className="
          relative grid
          w-full
          gap-8
          p-3
          rounded-xl
          shadow-[0_0_40px_rgba(0,0,0,0.6)]
          bg-black
          backdrop-blur-2xl

          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-5
        "
      >
        {movies?.slice(0, limit).map((m) => (
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

            {/* INTERESTED COUNT, in place of the media-type label */}
            <div className="text-muted-foreground text-xs tracking-wide">
              {m.interestedCount} interested · {m.interestedType === "series" ? "Series" : "Movie"}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MostInterested