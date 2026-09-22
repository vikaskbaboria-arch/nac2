"use client";
import React, { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/masterfetch";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { useRouter, useSearchParams } from "next/navigation";

const Search = ({ movie }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [movies, setMovies] = useState(null);
  const [pages, setPages] = useState(pageFromUrl);
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    fetchMovies({
      type: "search",
      query: movie,
      type_of: "multi",
      page: pages,
    }).then((m) => setMovies(m));
  }, [movie, pages]);

  const totalpages = movies?.total_pages;

  const handleClick = (m) => {
    if (m.media_type === "movie") {
      router.push(`/movie/${m.id}?type=movie`);
    } else {
      router.push(`/movie/${m.id}?type=tv`)
    }
  };

  const toggleOverview = (e, id) => {
    e.stopPropagation();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    router.push(`?page=${pages}`, { scroll: true });
  }, [pages]);

  return (
    <div className="w-full min-h-[89vh] px-4 sm:px-8 py-8 flex flex-col gap-5">
      {movies?.results?.map((m) => {
        const isExpanded = !!expandedIds[m.id];

        return (
          <div
            key={m.id}
            onClick={() => handleClick(m)}
            className="
              group
              relative
              flex flex-row
              gap-5 sm:gap-8
              items-start
              w-full
              max-w-[1080px]
              mx-auto
              p-3 sm:p-5
              rounded-2xl
              border border-white/10
              bg-gradient-to-b from-black/60 to-black/30
              backdrop-blur-2xl
              shadow-[0_0_40px_rgba(0,0,0,0.6)]
              cursor-pointer
              transition-colors
              hover:bg-white/10
            "
          >
            {/* POSTER */}
            <div
              className="
                relative flex-shrink-0
                w-24 sm:w-32 md:w-36 lg:w-40
                aspect-[2/3]
                overflow-hidden
                rounded-lg
              "
            >
              <img
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                    : "/placeholder.png"
                }
                alt={m.title || m.name}
                className="
                  absolute inset-0
                  w-full h-full object-cover
                  transition-transform duration-300
                  group-hover:scale-105
                "
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
            </div>

            {/* MOVIE DATA */}
            <div className="text-white w-full min-w-0">
              <div className="text-lg sm:text-2xl font-bold mb-1 truncate">
                <AnimatedShinyText>{m?.title || m?.name}</AnimatedShinyText>
              </div>

              <div className="text-white/60 text-xs tracking-wide mb-3">
                <AnimatedShinyText>
                  {m.media_type === "movie" ? "Movie" : "Series"}
                </AnimatedShinyText>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-slate-400 font-semibold text-sm">
                  Overview
                </span>

                <p
                  className={`
                    text-gray-200 leading-relaxed text-xs sm:text-sm
                    ${isExpanded ? "" : "line-clamp-3"}
                    md:line-clamp-none
                    transition-all duration-300
                  `}
                >
                  {m?.overview || "No overview available."}
                </p>

                {m?.overview?.length > 100 && (
                  <button
                    onClick={(e) => toggleOverview(e, m.id)}
                    className="md:hidden text-purple-400 text-sm font-semibold self-start"
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* PAGINATION */}
      {totalpages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6 text-white">
          <button
            onClick={() => setPages((p) => Math.max(1, p - 1))}
            disabled={pages <= 1}
            className="
              px-4 py-2 rounded-md
              border border-white/10
              bg-white/5 hover:bg-white/10
              disabled:opacity-40 disabled:cursor-not-allowed
              transition
            "
          >
            Prev
          </button>

          <span className="text-sm text-white/70">
            {pages} / {totalpages}
          </span>

          <button
            onClick={() => setPages((p) => Math.min(totalpages, p + 1))}
            disabled={pages >= totalpages}
            className="
              px-4 py-2 rounded-md
              bg-black/50 hover:bg-black/70
              disabled:opacity-40 disabled:cursor-not-allowed
              transition
            "
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;