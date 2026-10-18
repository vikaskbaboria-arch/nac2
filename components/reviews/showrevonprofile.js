"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, EyeOff, Film, Star, Trash2 } from "lucide-react";
import { fetchMovies } from "@/lib/masterfetch";

function ReviewEntry({ review, isOwner, onDelete }) {
  const [movie, setMovie] = useState(null);
  const [movieLoading, setMovieLoading] = useState(true);
  const [showSpoiler, setShowSpoiler] = useState(!review.spoiler);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const movieId = review.movie?.movieid;
  const mediaType = review.movie?.media_type === "tv" ? "tv" : "movie";

  useEffect(() => {
    if (!movieId) {
      setMovieLoading(false);
      return;
    }
    let active = true;
    fetchMovies({ type: "byid", id: movieId, type_of: mediaType })
      .then((result) => active && setMovie(result))
      .catch(() => {})
      .finally(() => active && setMovieLoading(false));
    return () => {
      active = false;
    };
  }, [movieId, mediaType]);

  const title = movie?.title || movie?.name || review.movie?.movieTitle || (movieId ? `Title #${movieId}` : "Film review");
  const poster = movie?.poster_path || review.movie?.moviePoster;
  const movieHref = movieId ? `/movie/${movieId}?type=${mediaType}` : null;
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
    : "";

  const deleteReview = async () => {
    if (!movieId || !window.confirm("Delete this review? This can’t be undone.")) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const response = await fetch("/api/review", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieid: Number(movieId) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete this review");
      onDelete(review._id);
    } catch (error) {
      setDeleteError(error.message || "Unable to delete this review");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="w-[72px] shrink-0 sm:w-24">
          {movieHref ? (
            <Link href={movieHref} aria-label={`Open ${title}`} className="block aspect-[2/3] overflow-hidden rounded-xl bg-white/5">
              {poster ? <img src={`https://image.tmdb.org/t/p/w185${poster}`} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-white/30"><Film size={22} /></div>}
            </Link>
          ) : <div className="grid aspect-[2/3] place-items-center rounded-xl bg-white/5 text-white/30"><Film size={22} /></div>}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">{mediaType === "tv" ? "Series review" : "Movie review"}</p>
              {movieHref ? <Link href={movieHref} className="mt-1 block truncate text-base font-semibold text-white hover:text-purple-200 sm:text-lg">{title}</Link> : <h3 className="mt-1 truncate text-base font-semibold">{title}</h3>}
            </div>
            {isOwner && <button type="button" onClick={deleteReview} disabled={deleting} aria-label={`Delete review for ${title}`} title="Delete review" className="shrink-0 rounded-lg p-2 text-white/35 transition hover:bg-red-400/10 hover:text-red-200 disabled:opacity-50"><Trash2 size={15} /></button>}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45">
            {typeof review.rating === "number" && <span className="inline-flex items-center gap-1.5 text-amber-200"><Star size={13} fill="currentColor" />{review.rating}/10</span>}
            {date && <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />{date}</span>}
          </div>

          {review.review ? (
            <div className="mt-3">
              {review.spoiler && !showSpoiler ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200/10 bg-amber-100/[0.035] px-3 py-2.5 text-xs text-white/55">
                  <span>Spoiler hidden</span>
                  <button type="button" onClick={() => setShowSpoiler(true)} className="inline-flex items-center gap-1.5 font-medium text-amber-100 hover:text-white"><Eye size={13} />Show review</button>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-white/70">{review.review}</p>
                  {review.spoiler && <button type="button" onClick={() => setShowSpoiler(false)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70"><EyeOff size={13} />Hide spoiler</button>}
                </>
              )}
            </div>
          ) : <p className="mt-3 text-sm italic text-white/35">Rating only</p>}
          {deleteError && <p role="alert" className="mt-2 text-xs text-red-200">{deleteError}</p>}
          {movieLoading && !review.movie?.movieTitle && <span className="sr-only">Loading title</span>}
        </div>
      </div>
    </article>
  );
}

export function ShowRevonProflie({ username, isOwner = false, onReviewDeleted }) {
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const query = username ? `?username=${encodeURIComponent(username)}` : "";
    fetch(`/api/review/user${query}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load reviews");
        if (active) setReviews(data.reviews || []);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message || "Unable to load reviews");
          setReviews([]);
        }
      });
    return () => {
      active = false;
    };
  }, [username]);

  if (reviews === null) {
    return <div className="space-y-3" aria-label="Loading reviews">{[0, 1, 2].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]" />)}</div>;
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div><h2 className="text-xl font-semibold">Reviews</h2><p className="mt-1 text-sm text-white/45">Notes and ratings across movies and series.</p></div>
        <span className="text-sm text-white/40">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">{error}</p>}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/5 text-white/45"><Film size={20} /></div>
          <h3 className="mt-4 font-medium">No reviews yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-white/45">{isOwner ? "Your movie and series reviews will show up here. Open a title and share your take." : "When this member writes a review, it will appear here."}</p>
          {isOwner && <Link href="/explore/trending" className="mt-4 inline-flex rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-500">Explore titles</Link>}
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => <ReviewEntry key={review._id} review={review} isOwner={isOwner} onDelete={(id) => { setReviews((current) => current.filter((entry) => entry._id !== id)); onReviewDeleted?.(); }} />)}
        </div>
      )}
    </section>
  );
}
