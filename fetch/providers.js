const fetchProviders = async ({ media_type = "movie", id }) => {
  if (!id) {
    throw new Error("TMDB id is required");
  }

  const apiKey = process.env.SERVER_API;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY missing in env");
  }

  const url = `https://api.themoviedb.org/3/${media_type}/${id}/watch/providers?api_key=${apiKey}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 }, // ✅ cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`TMDB error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("TMDB providers fetch failed:", err.message);

    // ✅ fail gracefully instead of crashing page
    return null;
  }
};

export { fetchProviders };
