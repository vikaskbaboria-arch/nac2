"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { Footer } from "@/components/footer"

export default function CollectionPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState("all")
  const [filterType, setFilterType] = useState("all") // all, movie, tv
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    let isMounted = true

    async function loadCollection() {
      try {
        const res = await fetch("/api/nac-collection")
        const data = await res.json()
        if (isMounted) {
          setItems(data?.items || [])
        }
      } catch (err) {
        console.error("Error loading collection:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCollection()

    return () => {
      isMounted = false
    }
  }, [])

  // Unique tags list
  const tags = ["all", ...new Set(items.map((i) => i.tag).filter(Boolean))]

  const filteredItems = items.filter((item) => {
    const matchesTag = selectedTag === "all" || item.tag === selectedTag
    const matchesType = filterType === "all" || item.mediaType === filterType
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.curatorNote?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesType && matchesSearch
  })

  const handleClick = (item) => {
    const id = item.movieId || item.id
    if (item.mediaType === "tv") {
      router.push(`/movie/${id}?type=tv`)
    } else {
      router.push(`/movie/${id}?type=movie`)
    }
  }

  return (
    <div className=" min-h-screen text-white pt-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>✨</span>
            <span>Hand-Selected Vault</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            The NAC Collection
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A permanent archive of timeless cinema, cult classics, and cinematic masterworks personally chosen by NAC curators.
          </p>

          {session?.user?.isAdmin && (
            <div className="mt-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 hover:scale-105 transition"
              >
                <span>⚙️ Manage Collection in Admin</span>
              </Link>
            </div>
          )}
        </div>

        {/* CONTROLS: TAGS + SEARCH + TYPE */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
          {/* TAG PILLS */}
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedTag === tag
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tag === "all" ? "All Tags" : tag}
              </button>
            ))}
          </div>

          {/* SEARCH & MEDIA TYPE */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collection..."
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition w-full sm:w-48"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500 transition"
            >
              <option value="all">All Media</option>
              <option value="movie">Movies</option>
              <option value="tv">Series</option>
            </select>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div
                key={n}
                className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-black/20 border border-white/10">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="text-lg font-semibold text-slate-300">
              No matching titles found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {items.length === 0
                ? "The collection is currently empty. "
                : "Try adjusting your tag filter or search terms."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredItems.map((m) => (
              <div
                key={m._id}
                onClick={() => handleClick(m)}
                className="group cursor-pointer rounded-2xl p-2.5 bg-black/40 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* POSTER */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
                  <img
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                        : "/placeholder.png"
                    }
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    alt={m.title}
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

                  {/* TAG */}
                  {m.tag && (
                    <div className="absolute top-2 left-2 max-w-[85%] bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-semibold border border-amber-500/30 truncate">
                      {m.tag}
                    </div>
                  )}

                  {/* RATING */}
                  {m.vote_average ? (
                    <div className="absolute top-2 right-2 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded text-[11px] text-green-400 font-bold border border-green-500/30">
                      ★ {Number(m.vote_average).toFixed(1)}
                    </div>
                  ) : null}
                </div>

                {/* DETAILS */}
                <div className="mt-2.5">
                  <div className="text-sm font-semibold truncate text-white group-hover:text-purple-300 transition">
                    <AnimatedShinyText>{m.title}</AnimatedShinyText>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>{m.mediaType === "tv" ? "TV Series" : "Movie"}</span>
                    {m.release_date && (
                      <span>{m.release_date.slice(0, 4)}</span>
                    )}
                  </div>

                  {m.curatorNote && (
                    <p className="text-[11px] text-purple-300/80 mt-1.5 line-clamp-1 italic">
                      &ldquo;{m.curatorNote}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  )
}
