"use client"
import React, { useEffect, useState } from "react"
import { fetchMovies } from "@/lib/masterfetch"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import MovieCard from "./MovieCard"
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
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  )
}

export default EditorsPick