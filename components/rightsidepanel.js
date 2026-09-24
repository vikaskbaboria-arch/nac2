"use client";

import { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/masterfetch";
import { useRouter } from "next/navigation";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

export default function Rightsidepanel() {
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadMovies() {
      try {
        const res = await fetch("/api/intrested/top?limit=12");
        const data = await res.json();

        const top = data?.top || [];

        const results = await Promise.all(
          top.map(async (t) => {
            try {
              const movie = await fetchMovies({
                type: "byid",
                id: t.movieid,
                type_of: t.type === "series" ? "tv" : "movie",
              });

              return {
                ...movie,
                interestedCount: t.count,
                interestedType: t.type,
              };
            } catch {
              return null;
            }
          })
        );

        if (mounted) {
          setMovies(results.filter(Boolean));
        }
      } catch (error) {
        console.error("Failed to load interested movies:", error);

        if (mounted) {
          setMovies([]);
        }
      }
    }

    loadMovies();

    return () => {
      mounted = false;
    };
  }, []);

  const handleClick = (m) => {
    router.push(
      `/movie/${m.id}?type=${
        m.interestedType === "series" ? "tv" : "movie"
      }`
    );
  };

  return (
    <aside
      className="
        hidden lg:block w-[420px]
        h-[626px] rounded-2xl
        bg-gradient-to-b from-black/60 to-black/30
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
      "
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-white text-lg font-semibold tracking-wide">
          🔥 Most Interested
        </h2>

        <p className="text-xs text-white/40 mt-0.5">
          Popular with users right now
        </p>
      </div>

      {/* Scroll Area */}
      <div
        className="
          h-[520px]
          overflow-y-auto
          px-4 py-4 space-y-3
          scrollbar-hidden
        "
      >
        {movies.slice(0, 12).map((m) => {
          const title = m.title || m.name || "Untitled";

          return (
            <div
              key={`${m.interestedType}-${m.id}`}
              onClick={() => handleClick(m)}
              className="
                group flex gap-3 p-3 rounded-xl
                bg-white/[0.02]
                hover:bg-white/[0.06]
                transition-all duration-300 ease-out
                cursor-pointer
              "
            >
              {/* Poster */}
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

              {/* Details */}
              <div className="flex flex-col justify-between flex-1 overflow-hidden">
                <div>
                  <p
                    className="
                      text-white text-sm font-medium
                      leading-snug truncate
                    "
                  >
                    {title}
                  </p>

                  <p className="text-xs text-white/40 mt-1">
                    {m.interestedType === "series"
                      ? "Series"
                      : "Movie"}
                  </p>
                </div>

                <span className="text-xs text-white/60">
                  🔥 {m.interestedCount} interested
                </span>
              </div>
            </div>
          );
        })}

        {movies.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-white/40">
              No data available
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}