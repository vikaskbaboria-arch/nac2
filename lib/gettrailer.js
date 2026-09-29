async function getTrailerUrl(movieId, type = "movie") {
  try {
    const res = await fetch(`/api/tmdb/${type}/${movieId}/videos`);
    if (!res.ok) return null;

    const data = await res.json();
    const youtubeVideos = (data.results || []).filter(
      (video) => video.site === "YouTube" && video.key
    );
    const video =
      youtubeVideos.find((item) => item.type === "Trailer") ||
      youtubeVideos.find((item) => item.type === "Teaser") ||
      youtubeVideos.find((item) => item.type === "Clip");

    return video
      ? `https://www.youtube.com/embed/${video.key}?mute=0&controls=1&autoplay=1`
      : null;
  } catch (error) {
    console.error("Failed to load trailer:", error);
    return null;
  }
}

export { getTrailerUrl };
