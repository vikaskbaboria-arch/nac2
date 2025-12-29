// lib/tmdb.js
export async function getMovie(tmdbId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      cache: "force-cache",
    }
  );

  return res.json();
}
