
import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

function errorResponse(code, message, status, details) {
  return NextResponse.json(
    {
      error: message,
      code,
      ...(details === undefined ? {} : { details }),
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function GET(request) {
  let path = "";

  try {
    const url = new URL(request.url);
    const prefix = "/api/tmdb/";
    path = url.pathname.startsWith(prefix)
      ? url.pathname.slice(prefix.length)
      : "";

    if (!path) {
      return errorResponse(
        "TMDB_PATH_MISSING",
        "TMDB path missing",
        400
      );
    }

    const apiKey =
      process.env.TMDB_API_KEY || process.env.SERVER_API;

    if (!apiKey) {
      return errorResponse(
        "TMDB_API_KEY_MISSING",
        "TMDB API key not configured",
        500
      );
    }
    // console.log("tmdbbase",TMDB_BASE)
    const tmdbUrl = new URL(`${TMDB_BASE}/${path}`);

    tmdbUrl.search = url.search;
    tmdbUrl.searchParams.set("api_key", apiKey);

    // Shorter cache for search; longer cache for discovery and details.
    const isSearch = path.startsWith("search/");
    const cacheSeconds = isSearch ? 60 : 1800;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      8000
    );

    let response;

    try {
      response = await fetch(tmdbUrl.toString(), {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: cacheSeconds,
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const details = await response.json().catch(() => undefined);

      return errorResponse(
        "TMDB_UPSTREAM_ERROR",
        "TMDB request failed",
        response.status >= 500 ? 502 : response.status,
        details
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control":
          `public, s-maxage=${cacheSeconds}, ` +
          `stale-while-revalidate=${cacheSeconds * 2}`,
      },
    });
  } catch (error) {
    console.error("TMDB proxy error:", {
      path,
      message: error.message,
    });

    return errorResponse(
      "TMDB_UNAVAILABLE",
      "Unable to retrieve TMDB data",
      502
    );
  }
}
