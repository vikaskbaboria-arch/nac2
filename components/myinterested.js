"use client"
import React, { useEffect, useState } from "react"
import { fetchMovies } from "@/lib/masterfetch"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter } from "next/navigation"

/**
 * Same visual style as TrendingOnNAC, but sourced from the signed-in
 * user's own /api/interested list instead of TMDB trending. The stored
 * `type` ("movie" | "series") drives both the fetch and the click
 * target, so — unlike MostInterested before this change — nothing is
 * guessed here.
 */
const MyInterested = () => {
  const [movies, setMovies] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    fetch("/api/intrested")
      .then((res) => (res.ok ? res.json() : { interested: [] }))
      .then(async (data) => {
        const items = data?.interested || []
        const results = await Promise.all(
          items
            .filter((it) => it.movie?.movieid)
            .map((it) =>
              fetchMovies({
                type: "byid",
                id: it.movie.movieid,
                type_of: it.type === "series" ? "tv" : "movie",
              })
                .then((m) => ({ ...m, interestedType: it.type }))
                .catch(() => null)
            )
        )
        if (mounted) setMovies(results.filter(Boolean))
      })
      .catch(() => mounted && setMovies([]))

    return () => {
      mounted = false
    }
  }, [])

  const handleClick = (m) => {
    router.push(`/movie/${m.id}?type=${m.interestedType === "series" ? "tv" : "movie"}`)
  }

  if (movies && movies.length === 0) {
    return (
      <section className="w-full">
        <h2 className="font-display font-bold text-slate-300 text-xl sm:text-2xl mb-2 px-6">
          Your Interested List
        </h2>
        <p className="text-white/40 text-sm px-6">
          Nothing here yet — mark a movie or series as interested to see it in this row.
        </p>
      </section>
    )
  }

  return (
    <section className="w-full">
  

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
        {movies?.map((m) => (
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

            {/* MEDIA TYPE, from the stored value — not guessed */}
            <div className="text-muted-foreground text-xs tracking-wide">
              <AnimatedShinyText>
                {m.interestedType === "series" ? "Series" : "Movie"}
              </AnimatedShinyText>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MyInterested