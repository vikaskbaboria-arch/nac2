"use client"
import React, { useEffect, useState } from "react"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

const NacCollection = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    let isMounted = true

    async function loadCollection() {
      try {
        const res = await fetch("/api/nac-collection?limit=10")
        const data = await res.json()
        if (isMounted) {
          setItems(data?.items || [])
        }
      } catch (err) {
        console.error("Failed to load NAC collection:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCollection()

    return () => {
      isMounted = false
    }
  }, [])

  const handleClick = (item) => {
    const id = item.movieId || item.id
    if (item.mediaType === "tv") {
      router.push(`/movie/${id}?type=tv`)
    } else {
      router.push(`/movie/${id}?type=movie`)
    }
  }

  // Don't render empty section if visitor and no items
  if (!loading && items.length === 0 && !session?.user?.isAdmin) {
    return null
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-2 px-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-slate-300 text-xl sm:text-2xl flex items-center gap-2">
            <span>NAC Collection</span>
            <span className="text-xs bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
              Vault
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {session?.user?.isAdmin && (
            <Link
              href="/admin"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition"
            >
              <span>✏️</span>
              <span>Manage Collection</span>
            </Link>
          )}

          {items.length > 0 && (
            <Link
              href="/collection"
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 p-3 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="shrink-0 w-[140px] sm:w-[160px] aspect-[2/3] rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-6 mx-3 rounded-2xl bg-black/40 border border-white/10 text-center">
          <p className="text-sm text-slate-400 mb-2">
            No movies in the NAC Collection yet.
          </p>
          {session?.user?.isAdmin ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              + Add Movies to Collection
            </Link>
          ) : (
            <span className="text-xs text-slate-500">
              Curated titles will appear here soon.
            </span>
          )}
        </div>
      ) : (
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
            scrollbar-hidden
          "
        >
          {items.map((m) => (
            <div
              key={m._id}
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
                transition-all
                duration-200
                hover:bg-white/10
                hover:scale-[1.02]
              "
            >
              {/* POSTER */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-poster rounded-xl">
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
                  alt={m.title}
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition" />

                {/* TAG BADGE */}
                {m.tag && (
                  <div className="absolute top-2 left-2 max-w-[85%] bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-amber-300 font-semibold border border-amber-500/30 truncate">
                    {m.tag}
                  </div>
                )}
              </div>

              {/* TITLE */}
              <div className="mt-2 text-sm font-semibold overflow-hidden">
                <div
                  className={`
                    whitespace-nowrap
                    ${m?.title?.length > 20 ? "marquee" : ""}
                  `}
                >
                  <AnimatedShinyText>{m?.title}</AnimatedShinyText>
                </div>
              </div>

              {/* MEDIA TYPE & RATING */}
              <div className="flex items-center justify-between text-muted-foreground text-xs tracking-wide">
                <AnimatedShinyText>
                  {m.mediaType === "tv" ? "Series" : "Movie"}
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
      )}
    </section>
  )
}

export default NacCollection
