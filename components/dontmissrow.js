"use client"
import React, { useEffect, useState } from "react"
import MovieCard from "@/components/MovieCard"
import { fetchMovies } from "@/lib/masterfetch"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter } from "next/navigation"
import { ProviderRowSkeleton } from "@/components/skeletons/HomeSectionSkeletons"

/**
 * Shared row for "Don't Miss on <provider>" sections. I don't know the
 * exact param shape masterfetch expects for provider filtering — this
 * assumes { type: "provider", provider_id, watch_region, type_of }.
 * Adjust fetchParams (or the fetch call itself) to match your real API.
 */
const DontMissRow = ({ title, accentColor, fetchParams }) => {
  const [movies, setMovies] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchMovies(fetchParams)
      .then((m) => setMovies(m?.results ?? []))
      .catch((error) => {
        console.error(`Failed to load ${title}:`, error)
        setMovies([])
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchParams.type, fetchParams.provider_id, fetchParams.watch_region, fetchParams.type_of])

  const handleClick = (m) => {
    if (m.media_type === "movie" || fetchParams.type_of === "movie") {
      router.push(`/movie/${m.id}?type=movie`)
    } else {
      router.push(`/movie/${m.id}?type=tv`)
    }
  }

  if (movies === null) return <ProviderRowSkeleton />

  return (
    <section className="w-full">
      <h2 className="font-display font-bold text-slate-300 text-xl sm:text-2xl mb-2 px-6">
        <span
         
        />
        {title}
      </h2>

      <div
        className="
          relative grid
          w-full
          gap-2
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

export default DontMissRow