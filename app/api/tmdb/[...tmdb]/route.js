import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(request) {
  const url = new URL(request.url);

  // Derive TMDB path from the request pathname instead of using `params`.
  // Example: /api/tmdb/genre/movie/list -> 'genre/movie/list'
  const prefix = "/api/tmdb/";
  const pathname = url.pathname || "";
  const path = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : "";
  const qs = url.search; // includes leading '?'

  if (!path) {
    return NextResponse.json({ error: "TMDB path missing" }, { status: 400 });
  }

  const apiKey = process.env.TMDB_API_KEY || process.env.SERVER_API || process.env.NEXT_PUBLIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TMDB API key not configured on server" }, { status: 500 });
  }

  // Build TMDB URL and ensure api_key present
  const tmdbUrl = `${TMDB_BASE}/${path}${qs ? qs + "&" : "?"}api_key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(tmdbUrl, { next: { revalidate: 60 * 60 } });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
