const fetchProviders = async ({ media_type = "movie", id }) => {
  if (!id) {
    return null;
  }

  const isServer = typeof window === "undefined";
  try {
    if (isServer) {
      // Call TMDB directly from server-side using server API key to avoid fetching our own API route.
      const key = process.env.TMDB_API_KEY || process.env.SERVER_API;
      if (!key) {
        console.error("TMDB providers fetch failed: no TMDB API key in env");
        return null;
      }

      const tmdbUrl = new URL(
        `https://api.themoviedb.org/3/${media_type}/${id}/watch/providers`
      );
      tmdbUrl.searchParams.set("api_key", key);
      const res = await fetch(tmdbUrl);
      if (!res.ok) {
        console.error(
          `TMDB providers direct fetch error ${res.status} for ${media_type}/${id}`
        );
        return null;
      }
      return await res?.json();
    } else {
      // Client-side: call our internal proxy
      const path = `/api/tmdb/${media_type}/${id}/watch/providers`;
      const res = await fetch(path, { next: { revalidate: 60 * 60 } });
      if (!res?.ok) {
        const text = await res?.text().catch(() => "");
        console.error(`TMDB providers proxy error ${res.status} for ${path}: ${text}`);
        return null;
      }
      return await res?.json();
    }
  } catch (err) {
    console.error("TMDB providers fetch failed:", err?.message || err);
    return null;
  }
};

export { fetchProviders };
