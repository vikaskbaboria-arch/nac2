// lib/tmdb.js
export async function getMovie(tmdbId) {
  const res = await fetch(`/api/tmdb/movie/${tmdbId}?language=en-US`, { cache: "force-cache" });
  return res.json();
}
