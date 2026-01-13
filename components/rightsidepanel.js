"use client";
import { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/masterfetch";
import { useRouter, useSearchParams } from "next/navigation";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

export default function Rightsidepanel() {
  const [movies, setMovies] = useState([]);
  const router = useRouter();
  useEffect(() => {
    async function loadMovies() {
      const data = await fetchMovies(
        "/api/tmdb/popular?region=IN&page=1"
      );
      setMovies(data?.results || []);
    }
    loadMovies();
  }, []);
    const handleClick = (m) => {

    router.push(`/movie/${m?.id}`);
   
  };

  return (
    <aside
      className="
        hidden lg:block w-[420px]
        h-[671px] rounded-2xl
        bg-gradient-to-b from-black/60 to-black/30
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
      "
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-white text-lg font-semibold tracking-wide">
          🇮🇳 Trending in India
        </h2>
        <p className="text-xs text-white/40 mt-0.5">
          Popular right now
        </p>
      </div>

      {/* Scroll Area */}
      <div
        className="
          h-[580px]
          overflow-y-auto
          px-4 py-4 space-y-3
          scrollbar-hidden
        "
      >
        {movies.slice(0, 12).map((m) => {
          const title = m.title || m.name || "Untitled";

          return (
            <div
              key={m.id}
              className="
                group flex gap-4 p-3 rounded-xl
                bg-white/[0.02]
                hover:bg-white/[0.06]
                transition-all duration-300 ease-out
                cursor-pointer
              " onClick={()=>handleClick(m)}
            >
              <img
                src={
                  m.poster_path
                    ? `${IMAGE_BASE}${m.poster_path}`
                    : "/placeholder.png"
                }
                alt={title}
                className="
                  w-[65px] h-[95px]
                  rounded-lg object-cover
                  shadow-md
                  group-hover:scale-[1.03]
                  transition-transform duration-300
                "
              />

              <div className="flex flex-col justify-between flex-1 overflow-hidden">
                <p
                  className="
                    text-white text-sm font-medium
                    leading-snug truncate
                    group-hover:text-white
                  "
                >
                  {title}
                </p>

                <span className="text-xs text-white/60">
                  ⭐ {m.vote_average?.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
