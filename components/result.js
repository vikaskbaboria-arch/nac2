"use client";

import { useEffect, useState, useRef } from "react";
import Rating from "./rating";
import InterestedButton from "./interestedbutton";
import Watchlist from "./watchlist";
import ReviewsSection from "./parent";
import { fetchMovies } from "@/lib/masterfetch";
import { fetchCredit } from "@/fetch/credit";
import { getTrailerUrl } from "@/lib/gettrailer";
import { getCountryNames, getLanguageName } from "@/lib/localeNames";
import SeriesSkeleton from "./SeriesSkeleton";
import { div } from "framer-motion/client";
const SeriesR = (movies) => {
  const castRef = useRef(null);
const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  console.log("movies",movies.type)
  /* ================= FETCH DATA ================= */
  useEffect(() => {
    async function loadData() {
      const tvData = await fetchMovies({
        type: "byid",
        id: movies.movie,
        type_of: movies.type ,
      });

      setMovie(tvData);

      const creditsData = await fetchCredit(tvData.id, movies?.type);
      setCredits(creditsData);
     
      const trailer = await getTrailerUrl(tvData.id, "movie");
      setTrailerUrl(trailer);
             
      setLoading(false)
    }

    loadData();
  }, [movies.movie]);

  /* ================= LOCK BODY SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = showTrailer ? "hidden" : "auto";
  }, [showTrailer]);
  console.log("movies",movies.streamer)
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
    
    const creators = movie?.created_by || [];
    const director = credits?.crew?.filter((person) => person.job === "Director");
console.log(movie)

if (loading) {
  return <SeriesSkeleton />;
}
  return (
    <div className="w-full overflow-x-hidden bg-black text-white">
      {/* ================= HERO ================= */}
      <div className="relative min-h-[60vh] md:min-h-[85vh] w-full overflow-hidden">

        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent" />

        

   

 
      </div>

      {/* ================= POSTER + DETAILS ================= */}
      <div className="relative z-10 grid md:grid-cols-[240px_1fr]  px-6 sm:px-12  -mt-72 md:ml-28 ">

        <img
          src={poster}
          alt=""
          className="w-36 sm:w-40 md:w-52 rounded-xl shadow-2xl mx-auto md:mx-0"
        />
         
        <div className="flex flex-col   text-center md:text-left md:mt-46">
          {/* { title and duration and type } */}
          <div className=" gap-0">
            <div className="text-gray-400 font-semibold   pl-1 flex flex-row gap-3">
            <span>{movies?.type==="movie"?'Movie':'Tv'}</span>
              <span>{movie?.release_date?.slice(0,4) }</span>
              <span>{movie?.runtime
  ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
  : `${movie?.number_of_seasons || "N/A"} Seasons`}</span>
              
            </div>

             <h1 className="pt-0 text-2xl w-fit sm:text-3xl lg:text-4xl text-white/95 font-bold">
            {movies.type === "movie" ? movie?.title : movie?.name}
          </h1> 
          </div>
        
           <div className="flex flex-row pt-4 gap-22">
            <div className="flex flex-row gap-12">
                 {movies.type !== "tv" && (
            <div className="flex flex-col   justify-center md:justify-start">
              <span className=" text-white/50">Directed By</span>
              {director?.length > 0 ? (
                director.map((c) => (
                  <span   key={c.id} className=" font-semibold cursor-pointer">
                    {c.name } 
                    {`${creators.indexOf(c) !== creators.length - 1 ? "," : ""}`}
                  </span>
                ))
              ) : (
                <span className="text-white/50">N/A</span>
              )}
            </div>
          )}
          {movies.type === "tv" && (
            <div className="flex flex-col  justify-center md:justify-start">
              <span className="text-white/50 ">ShowRunner:</span>
              {creators.length > 0 ? (
                creators.slice(0,1).map((c) => (
                  <span key={c.id} className="font-semibold cursor-pointer">
                    {c.name}  
                    {`${creators.indexOf(c) !== creators.length - 1 ? "," : ""}`}
                  </span>
                ))
              ) : (
                <span className="text-white/50">N/A</span>
              )}
            </div>
          )}
            <div className=" flex  flex-col"> 
              <span className="text-white/50">Country </span>
             {movie?.origin_country &&
             <div className="text-white font-semibold">
              {getCountryNames(movie?.origin_country)}
             </div>
             }
              </div>
                </div>
           
           
                <div className=" flex  flex-col"> 
              <span className="text-white/50">language </span>
             {movie?.original_language &&
             <div className="text-white font-semibold">
              {getLanguageName(movie?.original_language)}
             </div>
             }
              </div>  
          {/* <div className=" flex gap-1">  Duration:
              {movie?.runtime && (  
                <span className="text-white/50 "> 
                  {movie.runtime} min
                </span>)}
              </div>   */}
        
           </div>
          
              </div>
         <div className="absolute  right-86 hidden lg:flex bottom-30 mr-18  z-20">
          <Watchlist movieId={movie?.id} />
      
        </div>
  <div className="absolute  right-86 hidden lg:flex bottom-20 mr-18  z-20">
          <InterestedButton
            movieID={movie?.id}
            type={movies?.type === "tv" ? "series" : movies?.type}
          />
      
        </div>

      </div>


      
      {/* ================= OVERVIEW + WATCH ================= */}
      <div className=" flex  flex-col xl:flex-row gap-16 px-6 sm:px-12 lg:px-40 py-12">

        <div className="max-w-3xl">
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

        <div className="w-full xl:w-[40%]   bg-gray-900 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Watch on</h3>

          {providersList.length > 0 ? (
            <div className="flex flex-row gap-3 max-w-full no-scrollbar overflow-x-auto">
              {providersList.map((p) => (
                <div
                  key={p.provider_id}
                  className="   flex-shrink-0
w-full
    flex items-center gap-3
    bg-black/60 p-3 rounded-md"
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

      {/* ================= CAST + REVIEWS ================= */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-40 mt-6">
        <div className="flex flex-col gap-12">

          <div>
            <h3 className="text-xl font-semibold mb-4">Cast</h3>

            <div
              ref={castRef}
              className="
                flex gap-4 sm:gap-6
                w-[800px]
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
              { credits?.cast?.slice(0, 12).map((m) => (
                <div key={m.id} className="flex-shrink-0 w-18 sm:w-28 text-center">
                  <div className="w-18 h-18 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto">
                    <img
                      src={
                        m.profile_path
                          ? `https://image.tmdb.org/t/p/w500${m.profile_path}`
                          : "/avatar.png"
                      }
                      onClick={() => window.location.assign(`/person/${m.id}`)}
                      alt={m.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold truncate">{m.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black pb-16">
            <ReviewsSection movieId={movie?.id} />
          </div>

        </div>
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