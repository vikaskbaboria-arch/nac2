import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

function errorResponse(code, message, status, details) {
  return NextResponse.json(
    {
      error: message,
      code,
      ...(details === undefined ? {} : { details }),
    },
    { status }
  );
}

export async function GET(request) {
  let path = "";

  try {
    const url = new URL(request.url);

    // Derive TMDB path from the request pathname instead of using `params`.
    // Example: /api/tmdb/genre/movie/list -> 'genre/movie/list'
    const prefix = "/api/tmdb/";
    const pathname = url.pathname || "";
    path = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : "";

    if (!path) {
      return errorResponse("TMDB_PATH_MISSING", "TMDB path missing", 400);
    }

    const apiKey =
      process.env.TMDB_API_KEY ||
      process.env.SERVER_API;
    if (!apiKey) {
      return errorResponse(
        "TMDB_API_KEY_MISSING",
        "TMDB API key not configured on server",
        500
      );
    }

    const tmdbUrl = new URL(`${TMDB_BASE}/${path}`);
    tmdbUrl.search = url.search;
    tmdbUrl.searchParams.set("api_key", apiKey);

    let response;
    let lastError;

    // Retry up to 3 times on transient network errors or ECONNRESET
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        response = await fetch(tmdbUrl.toString(), {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Connection: "close",
          },
          next: { revalidate: 60 * 60 },
        });

        clearTimeout(timeoutId);

        if (response && (response.ok || response.status < 500)) {
          break;
        }
      } catch (error) {
        lastError = error;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
        }
      }
    }

    if (!response) {
      console.error("TMDB proxy network error after retries:", { path, error: lastError });
      return errorResponse(
        "TMDB_UNAVAILABLE",
        "Unable to reach TMDB",
        502
      );
    }

    if (response.status === 204 || response.status === 304) {
      return new NextResponse(null, { status: response.status });
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("TMDB proxy returned invalid JSON:", {
        path,
        status: response.status,
        error,
      });
      return errorResponse(
        "TMDB_INVALID_RESPONSE",
        "TMDB returned an invalid response",
        502,
        { upstreamStatus: response.status }
      );
    }

    if (!response.ok) {
      console.error("TMDB proxy upstream error:", {
        path,
        status: response.status,
      });
      return errorResponse(
        "TMDB_UPSTREAM_ERROR",
        "TMDB request failed",
        response.status,
        data
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("TMDB proxy error:", { path, error: err });
    return errorResponse(
      "TMDB_PROXY_ERROR",
      "An unexpected error occurred while processing the TMDB request",
      500
    );
  }
}
