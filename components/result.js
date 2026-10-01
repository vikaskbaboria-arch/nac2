"use client";

import { useEffect, useState, useRef } from "react";
import {
  Play,
  Eye,
  Bookmark,
  Share2,
  ArrowUpRight,
  Info,
  X,
} from "lucide-react";
import InterestedButton from "./interestedbutton";
import Watchlist from "./watchlist";
import ReviewsSection from "./parent";
import { fetchMovies } from "@/lib/masterfetch";
import { fetchCredit } from "@/fetch/credit";
import { getTrailerUrl } from "@/lib/gettrailer";
import { getCountryNames, getLanguageName } from "@/lib/localeNames";
import SeriesSkeleton from "./SeriesSkeleton";
import Link from "next/link";

/* ---------- small helpers ---------- */
const formatRuntime = (mins) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

/* label + value pair used in the meta row */
const Meta = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-xs text-white/50 sm:text-sm">{label}</p>
    <div className="truncate text-sm font-semibold text-white sm:text-base">
      {children}
    </div>
  </div>
);

/* true when viewport >= lg (1024px); lets us mount ONE card instead of two */
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
};

const NewSeasonCard = ({ movieId, nextAir, onShare, className = "" }) => (
  <div
    className={`flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md ${className}`}
  >
    <div className="min-w-0">
      <p className="text-xs text-white/50">
        {nextAir ? "Next Episode" : "New Season"}
      </p>
      <p className="truncate text-sm font-semibold text-white sm:text-base">
        {nextAir ? formatDate(nextAir) : "To Be Confirmed"}
      </p>
      <button
        onClick={onShare}
        className="mt-1 inline-flex items-center gap-1 text-xs text-white/60 transition hover:text-white"
      >
        <Share2 size={12} /> Share
      </button>
    </div>
    <InterestedButton movieID={movieId} type="series" />
  </div>
);

const ActionButtons = ({ movieId }) => (
  <div className="flex flex-col gap-2.5">
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300"
    >
      <Eye size={18} /> Mark as Watched
    </button>
    <div className="grid grid-cols-2 gap-2.5 ">
      <button
        type="button"
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <Bookmark size={17} /> Collections
      </button>
      {/* your existing Watchlist component ("Watch Later") */}
      <div className="">
        <Watchlist movieId={movieId} />
      </div>
    </div>
  </div>
);

const SeriesR = (props) => {
  const { movie: movieId, type, streamer } = props;
  const isTv = type === "tv";

  const castRef = useRef(null);
  const isDesktop = useIsDesktop();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [rating, setRating] = useState(null);
  /* ================= FETCH DATA ================= */
  useEffect(() => {
    let cancelled = false;
    window.scrollTo(0, 0);

    async function loadData() {
      setLoading(true);
      const data = await fetchMovies({
        type: "byid",
        id: movieId,
        type_of: type,
      });
      const releaseDates = await fetchMovies({
        type: "byrelease_dates",
        id: movieId,
        type_of: type,
      });
      const india = releaseDates?.results?.find(
        (country) => country.iso_3166_1 === "IN",
      );
    
      const ageRating =
        india?.release_dates?.find((release) => release.certification)
          ?.certification || "N/A";

      setRating(ageRating);
      if (cancelled) return;
      setMovie(data);

      const [creditsData, trailer] = await Promise.all([
        fetchCredit(data.id, type),
        getTrailerUrl(data.id, isTv ? "tv" : "movie"),
      ]);
      if (cancelled) return;
      setCredits(creditsData);
      setTrailerUrl(trailer);
      setLoading(false);
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [movieId, type]);

  /* ================= LOCK BODY SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = showTrailer ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showTrailer]);

  /* ================= PROVIDERS ================= */
  const providerResults = streamer?.results || {};
  const regionObj =
    providerResults?.IN ||
    providerResults?.US ||
    Object.values(providerResults)[0] ||
    null;

  const providersList = [
    ...(regionObj?.flatrate || []).map((p) => ({ ...p, kind: "Subscription" })),
    ...(regionObj?.ads || []).map((p) => ({ ...p, kind: "Free with ads" })),
    ...(regionObj?.rent || []).map((p) => ({ ...p, kind: "Rent" })),
    ...(regionObj?.buy || []).map((p) => ({ ...p, kind: "Buy" })),
  ].filter(
    (p, i, arr) => arr.findIndex((x) => x.provider_id === p.provider_id) === i,
  );

  if (loading) return <SeriesSkeleton />;

  /* ================= DERIVED ================= */
  const poster = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.png";
  const cover = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : "";

  const title = isTv ? movie?.name : movie?.title;
  const year = (movie?.release_date || movie?.first_air_date || "").slice(0, 4);
  const runtime = formatRuntime(movie?.runtime || movie?.episode_run_time?.[0]);
  const ageMap = {
  "U": "0+",
  "UA": "13+",
  "A": "18+"
};
  const creators = movie?.created_by || [];
  const directors = credits?.crew?.filter((p) => p.job === "Director") || [];
  const leads = isTv ? creators : directors;
  const leadLabel = isTv ? "Showrunner" : "Director";
  const extraLeads = leads.length - 1;

  const genres = movie?.genres || [];
  const nextAir = movie?.next_episode_to_air?.air_date;

  const handleShare = async () => {
    const data = { title, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
    } catch {}
  };
   console.log("movie", movie);
  return (
    <div className="w-full overflow-x-hidden bg-[#030000] text-white">
      {/* ================= HERO ================= */}
      <div className="relative h-[38vh] aspect-video  min-h-[220px] w-full sm:h-[55vh] lg:h-[72vh]">
        {cover && (
          <img
            src={cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top opacity-100  "
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000fe] via-[#09090b]/30 to-transparent" />

        {/* play trailer */}
        <button
          type="button"
          onClick={() => trailerUrl && setShowTrailer(true)}
          disabled={!trailerUrl}
          aria-label={trailerUrl ? "Play trailer" : "Trailer unavailable"}
          title={trailerUrl ? "Play trailer" : "Trailer unavailable"}
          className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center group justify-center rounded-full bg-black/40 backdrop-blur transition-all hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:w-12 shadow-lg"
        >
          <Play
            size={20}
            className="fill-white transform translate-x-0.5 group-hover:scale-110"
          />
        </button>

        {/* desktop: New Season card floats over the hero */}
        {isTv && isDesktop && (
          <div className="absolute right-6 top-6 z-10 w-[320px] xl:right-16">
            <NewSeasonCard
              movieId={movie?.id}
              nextAir={nextAir}
              onShare={handleShare}
            />
          </div>
        )}
      </div>

      {/* ================= POSTER + DETAILS ================= */}
      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:-mt-24 sm:px-8 lg:-mt-50 lg:px-12">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-x-4 gap-y-5 sm:gap-x-6 lg:grid-cols-[auto_minmax(0,1fr)_340px] lg:gap-x-8">
          <img
            src={poster}
            alt={title}
            className="w-28 rounded-xl object-cover shadow-2xl ring-1 ring-white/10 sm:w-40 lg:w-52"
          />

          {/* info */}
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs text-white/60 sm:text-sm">
              <span>{isTv ? "Show" : "Movie"}</span>
              {year && <span>• {year}</span>}
              {runtime && <span>• {runtime}</span>}
              <Info size={13} className="text-white/40" />
            </p>

            <h1 className="mt-1 break-words text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:mt-5 sm:grid-cols-[repeat(4,auto)] sm:justify-start sm:gap-x-10">
              <Meta label={leadLabel}>
                {leads.length ? (
                  <>
                    {leads[0].name}
                    {extraLeads > 0 && (
                      <span className=" ml-1 font-normal text-white/50">
                        +{extraLeads}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-white/50">N/A</span>
                )}
              </Meta>

              <Meta label="Country">
                {movie?.origin_country ? (
                  <a
                    href={`/explore/country/${movie.origin_country}`}
                    className="hover:underline"
                  >
                    {getCountryNames(movie.origin_country)}
                  </a>
                ) : (
                  <span className="text-white/50">N/A</span>
                )}
              </Meta>

              <Meta label="Language" >
                {movie?.original_language
                  ? <Link href={`/explore/language/${movie.original_language}`} className="hover:underline">
                      {getLanguageName(movie.original_language)}
                    </Link>
                  : "N/A"}
              </Meta>

              {/* Age rating: pass movie.certification / content rating here if you have it */}
              <Meta label="Age Rating">{rating || "N/A"}</Meta>
            </div>
          </div>

          {/* actions: full width on mobile, right column on desktop */}
          <div className="col-span-2 lg:col-span-1 lg:self-end">
            <ActionButtons movieId={movie?.id} />
          </div>
        </div>

        {/* mobile / tablet: New Season card sits below the buttons */}
        {isTv && !isDesktop && (
          <div className="mt-4">
            <NewSeasonCard
              movieId={movie?.id}
              nextAir={nextAir}
              onShare={handleShare}
            />
          </div>
        )}

        {/* ================= OVERVIEW + WATCH ================= */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <div className="min-w-0">
            <h2 className="mb-3 text-lg font-semibold sm:text-xl">Overview</h2>
            <p
              className={`max-w-3xl leading-relaxed text-white/70 ${
                showFullOverview ? "" : "line-clamp-6 sm:line-clamp-none"
              }`}
            >
              {movie?.overview}
            </p>
            {movie?.overview?.length > 220 && (
              <button
                onClick={() => setShowFullOverview((v) => !v)}
                className="mt-2 text-sm text-purple-400 sm:hidden"
              >
                {showFullOverview ? "Show less" : "Show more"}
              </button>
            )}

            {genres.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full bg-white/[0.08] px-3.5 py-1.5 text-xs font-medium text-white/90 sm:text-sm"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* ---- Cast ---- */}
            <div className="mt-10">
              <h2 className="mb-4 text-lg font-semibold sm:text-xl">Cast</h2>
              <div
                ref={castRef}
                className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {credits?.cast?.slice(0, 12).map((m) => (
                  <a
                    key={m.id}
                    href={`/person/${m.id}`}
                    className="w-20 flex-shrink-0 text-center sm:w-28"
                  >
                    <img
                      src={
                        m.profile_path
                          ? `https://image.tmdb.org/t/p/w185${m.profile_path}`
                          : "/avatar.png"
                      }
                      alt={m.name}
                      className="mx-auto h-20 w-20 rounded-full object-cover sm:h-28 sm:w-28"
                    />
                    <p className="mt-2 truncate text-xs font-semibold">
                      {m.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <ReviewsSection movieId={movie?.id} />
            </div>
          </div>

          {/* ---- Watch Online card ---- */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] lg:sticky lg:top-6">
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <h3 className="text-sm font-semibold">Watch Online</h3>
              <button className="text-xs text-white/40 transition hover:text-white/70">
                Report?
              </button>
            </div>

            <div className="border-t border-white/10">
              {providersList.length > 0 ? (
                <ul className="divide-y divide-white/5">
                  {providersList.map((p) => (
                    <li key={`${p.provider_id}-${p.kind}`}>
                      <a
                        href={regionObj?.link || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/5"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt=""
                          className="h-10 w-10 rounded-lg"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {p.provider_name}
                          </p>
                          <p className="text-xs text-white/50">{p.kind}</p>
                        </div>
                        <ArrowUpRight size={16} className="text-white/60" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-4 text-sm text-white/50">
                  Not available in your region
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <div className="h-16" />

      {/* ================= TRAILER OVERLAY ================= */}
      {showTrailer && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-black/80 px-4 py-2 text-sm text-white"
          >
            <X size={16} /> Close
          </button>
          <iframe
            src={trailerUrl}
            title="Trailer"
            className="h-full w-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default SeriesR;
