"use client";

import { useEffect, useState, useRef } from "react";
import Rating from "./rating";
import Watchlist from "./watchlist";
import ReviewsSection from "./parent";
import { fetchMovies } from "@/lib/masterfetch";
import { fetchCredit } from "@/fetch/credit";
import { getTrailerUrl } from "@/lib/gettrailer";

const SeriesR = (movies) => {
  const castRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    async function loadData() {
      const tvData = await fetchMovies({
        type: "byid",
        id: movies.movie,
        type_of: "movie",
      });

      setMovie(tvData);

      const creditsData = await fetchCredit(tvData.id, "movie");
      setCredits(creditsData);

      const trailer = await getTrailerUrl(tvData.id, "movie");
      setTrailerUrl(trailer);
    }

    loadData();
  }, [movies.movie]);

  /* ================= LOCK BODY SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = showTrailer ? "hidden" : "auto";
  }, [showTrailer]);

  /* ================= PROVIDERS ================= */
  const providerResults = movies.streamer?.results || {};
  const regionObj =
    providerResults?.IN ||
    providerResults?.US ||
    Object.values(providerResults)[0] ||
    null;

  const providersList =
    regionObj?.flatrate ||
    regionObj?.buy ||
    regionObj?.rent ||
    regionObj?.ads ||
    [];

  const poster = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w780/${movie.poster_path}`
    : "/placeholder.png";

  const cover = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${movie.backdrop_path}`
    : "";
    const director = credits?.crew?.filter( (person) => person.job === "Director" );
console.log(movie)
  return (
    <div className="w-full overflow-x-hidden bg-black text-white">
      {/* ================= HERO ================= */}
      <div className="relative min-h-[60vh] md:min-h-[80vh] w-full overflow-hidden">

        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

        <div className="absolute top-4 right-4 z-20">
          <Rating movieId={movies.movie} />
        </div>

        <div className="absolute hidden lg:flex bottom-16 right-10 z-20">
          <Watchlist movieId={movie?.id} />
        </div>

        <div className="absolute inset-0 hidden lg:flex items-center justify-center z-20">
          <button
            onClick={() => setShowTrailer(true)}
            className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center hover:scale-110 transition"
          >
            <img src="/play.svg" alt="Play" />
          </button>
        </div>
      </div>

      {/* ================= POSTER + DETAILS ================= */}
      <div className="relative z-10 grid md:grid-cols-[240px_1fr] gap-6 px-6 sm:px-12  -mt-64 md:ml-28">

        <img
          src={poster}
          alt=""
          className="w-36 sm:w-40 md:w-52 rounded-xl shadow-2xl mx-auto md:mx-0"
        />

        <div className="flex flex-col gap-4 text-center md:text-left md:mt-40">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
            {movie?.name}
          </h1>

          <div className="flex gap-2 justify-center md:justify-start">
            <span className="text-white/50 font-bold">Director:</span>
            {director?.length > 0 ? (
              director.map((c) => (
                <span key={c.id} className="cursor-pointer">
                  {c.name}
                </span>
              ))
            ) : (
              <span className="text-white/40">N/A</span>
            )}
          </div>
        </div>
      </div>

      {/* ================= OVERVIEW + WATCH ================= */}
      <div className="flex flex-col xl:flex-row gap-16  px-6 sm:px-12 lg:px-36 py-12">

        <div className="max-w-4xl">
          <h3 className="text-slate-400 text-xl sm:text-3xl font-bold mb-4">
            Overview
          </h3>

          <p
            className={`text-white/60 leading-relaxed ${
              showFullOverview ? "" : "line-clamp-4"
            }`}
          >
            {movie?.overview}
          </p>

          {movie?.overview?.length > 120 && (
            <button
              onClick={() => setShowFullOverview(!showFullOverview)}
              className="md:hidden text-purple-400 mt-2"
            >
              {showFullOverview ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        <div className="w-full xl:w-[30%] bg-gray-900 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Watch on</h3>

          {providersList.length > 0 ? (
            <div className="flex flex-col gap-3">
              {providersList.map((p) => (
                <div
                  key={p.provider_id}
                  className="flex items-center gap-4 bg-black/60 p-3 rounded-md"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-10 h-10 rounded-md"
                  />
                  <span>{p.provider_name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Not available in your region
            </p>
          )}
        </div>
      </div>

      {/* ================= CAST =================  and */}
      <div className="flex flex-col xl:flex-row gap-16  px-6 sm:px-12 lg:px-36 py-0">
             
      <div className="px-6 sm:px-12 pb-12">
        <h3 className="text-xl font-semibold mb-4">Cast</h3>

        <div
          ref={castRef}
          className="
            flex gap-4 sm:gap-6
            overflow-x-auto overflow-y-hidden
            touch-pan-x
            scroll-smooth
            overscroll-x-contain
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {credits?.cast?.slice(0, 8).map((m) => (
            <div key={m.id} className="flex-shrink-0 w-24 sm:w-32 text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto">
                <img
                  src={
                    m.profile_path
                      ? `https://image.tmdb.org/t/p/w500${m.profile_path}`
                      : "/avatar.png"
                  }
                  alt={m.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mt-2 text-xs font-semibold truncate">{m.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        
      </div>
      </div>
 

      {/* ================= REVIEWS ================= */}
      <div className="bg-black pb-16">
        <ReviewsSection movieId={movie?.id} />
      </div>

      {/* ================= TRAILER OVERLAY ================= */}
      {showTrailer && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-5 right-5 z-10 bg-black/90 px-4 py-2 rounded text-white"
          >
            ✕ Close
          </button>

          <iframe
            src={trailerUrl}
            title="Trailer"
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default SeriesR;
