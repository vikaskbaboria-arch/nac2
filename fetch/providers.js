const fetchProviders = async ({ media_type = "movie", id }) => {
  if (!id) {
    return null;
  }

  try {
    const path = `/api/tmdb/${encodeURIComponent(media_type)}/${encodeURIComponent(id)}/watch/providers`;
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXTAUTH_URL ||
          (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
          "http://localhost:3000"
        : window.location.origin;
    const res = await fetch(new URL(path, baseUrl), {
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) {
      console.error(
        `TMDB providers proxy error ${res.status} for ${media_type}/${id}`
      );
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("TMDB providers fetch failed:", err?.message || err);
    return null;
  }
};

export { fetchProviders };
