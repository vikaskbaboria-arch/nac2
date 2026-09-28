"use client"
import React, { useEffect, useState } from "react"
import { fetchMovies } from "@/lib/masterfetch"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { EditorsPickSkeleton } from "@/components/skeletons/HomeSectionSkeletons"

/**
 * Displays custom Admin-curated Editor's Picks if configured.
 * Gracefully falls back to top_rated movies if no custom picks exist yet.
 */
const EditorsPick = ({
  fetchParams = { type: "top_rated", type_of: "movie" },
}) => {
  const [movies, setMovies] = useState(null)
  const [isCustom, setIsCustom] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    let isMounted = true

    async function loadPicks() {
      try {
        const res = await fetch("/api/editors-pick")
        const data = await res.json()

        if (isMounted && data?.picks && data.picks.length > 0) {
          // Normalize custom picks to match the movie object structure
          const formatted = data.picks.map((p) => ({
            id: p.movieId,
            movieId: p.movieId,
            title: p.title,
            name: p.title,
            poster_path: p.poster_path,
            backdrop_path: p.backdrop_path,
            vote_average: p.vote_average,
            media_type: p.mediaType,
            curatorNote: p.curatorNote,
          }))
          setMovies(formatted)
          setIsCustom(true)
          return
        }
      } catch (err) {
        console.error("Failed to load custom editor's picks, falling back to TMDB:", err)
      }

      // Fallback to top_rated
      try {
        const m = await fetchMovies(fetchParams)
        if (isMounted) {
          setMovies(m?.results ?? [])
          setIsCustom(false)
        }
      } catch (err) {
        console.error("Failed to load editor's picks:", err)
        if (isMounted) {
          setMovies([])
          setIsCustom(false)
        }
      }
    }

    loadPicks()

    return () => {
      isMounted = false
    }
  }, [fetchParams.type, fetchParams.type_of, fetchParams.time])

  const handleClick = (m) => {
    const id = m.movieId || m.id
    const isMovie = (m.media_type ?? fetchParams.type_of) === "movie"
    if (isMovie) {
      router.push(`/movie/${id}?type=movie`)
    } else {
      router.push(`/movie/${id}?type=tv`)
    }
  }

  if (movies === null) return <EditorsPickSkeleton />

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-2 px-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-slate-300 text-xl sm:text-2xl">
            Editor&apos;s Pick
          </h2>
          {isCustom && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Curated
            </span>
          )}
        </div>

        {session?.user?.isAdmin && (
          <Link
            href="/admin"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition"
          >
            <span>✏️</span>
            <span>Edit Picks</span>
          </Link>
        )}
      </div>

      <div
        className="
          relative grid
          w-full
          gap-1
          sm:gap-4
          sm:p-3
          rounded-xl
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-5
        "
      >
        {movies?.slice(0, 5).map((m) => (
          <div
            key={m.id || m.movieId}
            onClick={() => handleClick(m)}
            className="
              group
              cursor-pointer
              w-full
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

              {/* Curator Note Badge if available */}
              {m.curatorNote && (
                <div className="absolute top-2 left-2 max-w-[85%] bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-purple-200 border border-purple-500/30 truncate">
                  ★ {m.curatorNote}
                </div>
              )}
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

            {/* MEDIA TYPE & RATING */}
            <div className="flex items-center justify-between text-muted-foreground text-xs tracking-wide">
              <AnimatedShinyText>
                {(m.media_type ?? fetchParams.type_of) === "movie" ? "Movie" : "Series"}
              </AnimatedShinyText>
              {m.vote_average ? (
                <span className="text-[11px] text-green-400 font-medium">
                  ★ {Number(m.vote_average).toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EditorsPick