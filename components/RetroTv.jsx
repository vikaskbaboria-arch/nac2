"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMovies } from "@/lib/masterfetch";

export default function RetroTV() {
  const [shows, setShows] = useState([]);
  const [channel, setChannel] = useState(0);
  const [paused, setPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchMovies({ type: "trending", type_of: "all" });
      if (!mounted) return;
      setShows((res?.results || []).filter((m) => m.backdrop_path).slice(0, 6));
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!shows.length || paused) return;
    const id = setInterval(() => {
      setChannel((c) => (c + 1) % shows.length);
    }, 4500);
    return () => clearInterval(id);
  }, [shows.length, paused]);

  const current = shows[channel];

  const goToChannel = (i) => setChannel(i);
  const changeChannel = (dir) => {
    if (!shows.length) return;
    setChannel((c) => (c + dir + shows.length) % shows.length);
  };

  const handleWatch = () => {
    if (!current) return;
    if (current.media_type === "movie") router.push(`/movie/${current.id}?type=movie`);
    else router.push(`/series/${current.id}?type=tv`);
  };

  return (
    <div className="w-full flex flex-col  items-center px-4 pt-8 pb-4 sm:pt-14">
      {/* Marquee-style heading */}
  
     
      {/* ===== The television set ===== */}
      <div
        className="relative w-full max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* antenna */}
    

        {/* TV body */}
        <div className="crt-set relative z-10 p-4 sm:p-6 flex flex-col  sm:flex-row gap-4 sm:gap-6">
          {/* screen */}
          <div
            className="crt-screen crt-glow relative flex-1 aspect-video cursor-pointer"
            onClick={handleWatch}
          >
            {current ? (
              <img
                key={current.id}
                src={`https://image.tmdb.org/t/p/w1280/${current.backdrop_path}`}
                alt={current.title || current.name}
                className="sepia-media absolute inset-0 w-full h-full object-cover animate-scaleIn"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-cream-dim font-serif text-sm">
                Tuning in&hellip;
              </div>
            )}
            <div className="crt-vignette" />

            {/* title bar on screen, like a channel caption */}
            {current && (
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-t from-black/85 to-transparent">
                <p className="text-gray-200 font-heading text-sm sm:text-lg truncate">
                  {current.title || current.name}
                </p>
                <p className="text-gray-300 font-serif text-[10px] sm:text-xs tracking-wide uppercase">
                  {current.media_type === "movie" ? "Feature Film" : "Series"} 
                </p>
              </div>
            )}
          </div>

          {/* control panel */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-6 sm:w-20">
            <div className="crt-knob w-9 h-9 sm:w-12 sm:h-12 rounded-full" />
            <div className="flex sm:flex-col gap-2">
              <button
                aria-label="previous channel"
                onClick={() => changeChannel(-1)}
                className="px-2 py-1 bg-black sm:px-3 sm:py-1.5 rounded bg-paper-3 text-white text-xs font-serif border border-cream/10 hover:text-mustard hover:border-mustard/40 transition"
              >
                CH −
              </button>
              <button
                aria-label="next channel"
                onClick={() => changeChannel(1)}
                className="px-2 py-1 bg-black sm:px-3 sm:py-1.5 rounded bg-paper-3 text-white text-xs font-serif border border-cream/10 hover:text-mustard hover:border-mustard/40 transition"
              >
                CH +
              </button>
            </div>
            
          </div>
        </div>

     
      </div>

      {/* channel dots */}
   
    </div>
  );
}
