"use client"
import React, { useEffect, useState } from "react"
import MovieCard from "@/components/MovieCard"
import { fetchMovies } from "@/lib/masterfetch"
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
  const [providerLogo, setProviderLogo] = useState(null)
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

  useEffect(() => {
    let cancelled = false
    const mediaType = fetchParams.type_of || "movie"
    const watchRegion = fetchParams.watch_region || "IN"

    fetch(`/api/tmdb/watch/providers/${mediaType}?watch_region=${watchRegion}`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return
        const provider = data.results?.find(
          (item) => item.provider_id === Number(fetchParams.provider_id)
        )
        setProviderLogo(provider?.logo_path || null)
      })
      .catch((error) => console.error(`Failed to load ${title} logo:`, error))

    return () => {
      cancelled = true
    }
  }, [fetchParams.provider_id, fetchParams.type_of, fetchParams.watch_region, title])

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
      <h2 className="mb-2 flex items-center gap-3 px-6 font-display text-xl font-bold text-slate-300 sm:text-2xl">
        {providerLogo && (
          <img
            src={`https://image.tmdb.org/t/p/w92${providerLogo}`}
            alt=""
            className="h-8 w-auto max-w-12 rounded object-contain"
          />
        )}
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