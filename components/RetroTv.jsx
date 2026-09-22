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
    <div className="w-full flex flex-col items-center px-4 pt-8 pb-4 sm:pt-14">
      {/* Marquee-style heading */}
      <p className="font-serif text-cream-dim tracking-[0.35em] text-[10px] sm:text-xs uppercase mb-2">
        Now Broadcasting
      </p>
      <h1 className="font-display text-cream text-3xl sm:text-5xl md:text-6xl text-center mb-8 drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
        Pull up a chair, <span className="text-mustard">NAC</span> is on
      </h1>

      {/* ===== The television set ===== */}
      <div
        className="relative w-full max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* antenna */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-end gap-6 z-0">
          <div className="w-[2px] h-16 bg-cream-dim/60 origin-bottom -rotate-[24deg]" />
          <div className="w-[2px] h-16 bg-cream-dim/60 origin-bottom rotate-[24deg]" />
        </div>

        {/* TV body */}
        <div className="crt-set relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
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
                <p className="text-cream font-heading text-sm sm:text-lg truncate">
                  {current.title || current.name}
                </p>
                <p className="text-mustard font-serif text-[10px] sm:text-xs tracking-wide uppercase">
                  {current.media_type === "movie" ? "Feature Film" : "Series"} &middot; Ch. {channel + 1}
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
                className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-paper-3 text-cream-dim text-xs font-serif border border-cream/10 hover:text-mustard hover:border-mustard/40 transition"
              >
                CH −
              </button>
              <button
                aria-label="next channel"
                onClick={() => changeChannel(1)}
                className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-paper-3 text-cream-dim text-xs font-serif border border-cream/10 hover:text-mustard hover:border-mustard/40 transition"
              >
                CH +
              </button>
            </div>
            <div className="crt-light w-2.5 h-2.5 rounded-full" />
          </div>
        </div>

        {/* wooden stand legs */}
        <div className="flex justify-between px-10 sm:px-16 -mt-1">
          <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-[#4a3220] to-[#241a10] rounded-b" />
          <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-[#4a3220] to-[#241a10] rounded-b" />
        </div>
      </div>

      {/* channel dots */}
      {shows.length > 0 && (
        <div className="flex gap-2 mt-5">
          {shows.map((s, i) => (
            <button
              key={s.id}
              aria-label={`channel ${i + 1}`}
              onClick={() => goToChannel(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === channel ? "bg-mustard" : "bg-cream-dim/30 hover:bg-cream-dim/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
