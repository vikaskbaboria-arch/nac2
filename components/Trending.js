"use client"
import React, { useEffect, useState } from "react"
import { fetchMovies } from "@/lib/masterfetch"
import MovieCard from "./MovieCard"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter } from "next/navigation"
import { TrendingSkeleton } from "@/components/skeletons/HomeSectionSkeletons"

const Trending = () => {
  const [movies, setMovies] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchMovies({
      type: "trending",
      time: "day",
      type_of: "all",
    })
      .then((m) => setMovies(m?.results ?? []))
      .catch((error) => {
        console.error("Failed to load trending movies:", error)
        setMovies([])
      })
  }, [])

  const handleClick = (m) => {
    if (m.media_type === "movie") {
      router.push(`/movie/${m.id}?type=movie`)
    } else {
      router.push(`/movie/${m.id}?type=tv`)
    }
  }

  if (movies === null) return <TrendingSkeleton />

  return (
    <section className="w-full ">
      <h2 className="font-display font-bold text-slate-300 text-xl sm:text-2xl mb-2 px-6">
        Trending on NAC
      </h2>
    <div
      className="
        relative grid
        w-full max-w-[1080px]
        gap-1
        sm:gap-4
        
        sm:p-3
        
        
        
     

        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-5
      "
    >
     
      {movies?.slice(0, 10).map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
    </section>
  )
}

export default Trending
