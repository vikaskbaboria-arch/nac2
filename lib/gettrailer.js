async function getTrailerUrl(movieId, type = "movie") {
  const res = await fetch(`/api/tmdb/${type}/${movieId}/videos`);
  const data = await res.json();

  const trailer = data.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return trailer
    ? `https://www.youtube.com/embed/${trailer.key}?mute=0&controls=1&autoplay=1`
    : null;
}

export { getTrailerUrl };
