"use client";

import { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/masterfetch";
import { useRouter } from "next/navigation";
import { InterestedPanelSkeleton } from "@/components/skeletons/HomeSectionSkeletons";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

export default function Rightsidepanel() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
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
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load interested movies:", error);

        if (mounted) {
          setMovies([]);
          setLoading(false);
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

  if (loading) return <InterestedPanelSkeleton />;

  return (
    <aside
      className="
        w-full min-w-0 overflow-hidden lg:rounded-lg
         lg:bg-gradient-to-b from-black/60 to-black/30
        lg:backdrop-blur-2xl
        lg:border border-white/20
        lg:shadow-[0_0_40px_rgba(0,0,0,0.6)]
        lg:h-[626px] lg:rounded-2xl
      "
    >
      {/* Header */}
      <div className="lg:border-b border-white/20 px-6 pt-3 pb-2 sm:px-6 lg:py-4 ">
        <h2 className="text-base font-bold tracking-wide text-white lg:text-lg">
           Most Interested
        </h2>

        <p className="text-xs text-white/40 mt-0.4">
          Popular with users right now
        </p>
      </div>

      {/* Scroll Area */}
      <div
        className="scrollbar-hidden flex gap-3 overflow-x-auto px-3 py-3 lg:block lg:h-[520px] lg:space-y-3 lg:overflow-x-hidden lg:overflow-y-auto lg:px-4 lg:py-4"
      >
        {movies.slice(0, 12).map((m) => {
          const title = m.title || m.name || "Untitled";

          return (
            <div
              key={`${m.interestedType}-${m.id}`}
              onClick={() => handleClick(m)}
              className="
                group flex w-[min(86vw,330px)] shrink-0 gap-3 rounded-lg p-2.5 px-2
               bg-black/60
               shadow-[0_0_20px_rgba(0,0,0,0.2)]
               border border-white/9
               backdrop-blur-2xl
                lg:bg-white/[0.02]
                lg:hover:bg-white/[0.06]
                transition-all duration-300 ease-out
                cursor-pointer
                lg:w-full lg:rounded-xl lg:p-3
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
                  h-[82px] w-[56px] shrink-0
                  rounded-lg object-cover
                  shadow-md
                  group-hover:scale-[1.03]
                  transition-transform duration-300
                  lg:h-[95px] lg:w-[65px]
                "
              />

              {/* Details */}
              <div className="flex min-w-0 flex-1 flex-col justify-between overflow-hidden">
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
          <div className="flex h-20 w-full shrink-0 items-center justify-center lg:h-full">
            <p className="text-sm text-white/40">
              No data available
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}