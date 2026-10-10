const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchMovies({
  type = "discover",
  query = "",
  page = 1,
  genre = "",
  year = "",
  fromDate = "",
  toDate = "",
  sortBy = "popularity.desc",
  type_of = "movie",
  id = "",
  time = "week",
  region = "IN",
  with_origin_country = "",
  with_original_language = "",
  certification = "",
  certification_country = "IN",
  runtime_min = "",
  runtime_max = "",

  // NEW
  provider_id = "",
  watch_region = "IN",
} = {}) {
  let url = "";

  switch (type) {
    case "popular":
      url = `${BASE_URL}/${type_of}/popular`;
      break;

    case "top_rated":
      url = `${BASE_URL}/${type_of}/top_rated`;
      break;

    case "trending":
      url = `${BASE_URL}/trending/${type_of}/${time}`;
      break;

    case "search":
      url = `${BASE_URL}/search/${type_of}?query=${encodeURIComponent(query)}`;
      break;

    case "t_p":
      url = `${BASE_URL}/${type_of}/${encodeURIComponent(query)}`;
      break;
      case "byrelease_dates":
        url =`${BASE_URL}/${type_of}/${id}/release_dates`;
        break;
      case "bycontent_ratings":
        url = `${BASE_URL}/${type_of}/${id}/content_ratings`;
        break;
    case "byid":
      url = `${BASE_URL}/${type_of}/${id}`;
      break;

    // NEW
    case "provider":
      url = `${BASE_URL}/discover/${type_of}`;
      break;

    default:
      url = `${BASE_URL}/discover/${type_of}`;
  }

  const params = new URLSearchParams({
    page: String(page),
  });

  if (genre) {
    params.append("with_genres", genre);
  }

  if (year) {
    params.append("primary_release_year", year);
  }
  
  if (fromDate) {
    params.append(type_of === "tv" ? "first_air_date.gte" : "primary_release_date.gte", fromDate);
  }

  if (toDate) {
    params.append(type_of === "tv" ? "first_air_date.lte" : "primary_release_date.lte", toDate);
  }

  if (sortBy && (type === "discover" || type === "provider")) {
    params.append("sort_by", sortBy);
  }

  if (with_origin_country && (type === "discover" || type === "provider")) {
    params.append("with_origin_country", with_origin_country);
  } else if (region && type === "discover" && type_of === "movie") {
    params.append("region", region);
  }
  if (with_original_language && (type === "discover" || type === "provider")) {
    params.append("with_original_language", with_original_language);
  }
  if (certification && (type === "discover" || type === "provider")) {
    params.append("certification_country", certification_country);
    params.append("certification", certification);
  }
  if (runtime_min && (type === "discover" || type === "provider")) {
    params.append("with_runtime.gte", String(runtime_min));
  }
  if (runtime_max && (type === "discover" || type === "provider")) {
    params.append("with_runtime.lte", String(runtime_max));
  }
  // TV discovery uses origin country rather than the movie release region.
  if (!with_origin_country && region && type === "discover" && type_of === "tv") {
    params.append("with_origin_country", region);
  }

  // =========================================
  // STREAMING PROVIDER FILTER
  // =========================================

  if (provider_id && type === "provider") {
    params.append("with_watch_providers", Array.isArray(provider_id) ? provider_id.join(",") : String(provider_id));
    params.append("watch_region", watch_region || "IN");
  }

  const finalUrl = url.includes("?")
    ? `${url}&${params.toString()}`
    : `${url}?${params.toString()}`;

  const proxyPath = finalUrl.replace(BASE_URL, "");

  try {
    const res = await fetch(`/api/tmdb${proxyPath}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(
        "masterfetch: proxy request failed",
        res.status,
        `/api/tmdb${proxyPath}`
      );

      return {};
    }

    return await res.json();
  } catch (err) {
    console.error("masterfetch: fetch error", err);
    return {};
  }
}

export async function fetchAgeRating(id, mediaType = "movie") {
  const isTv = mediaType === "tv";
  const data = await fetchMovies({
    type: isTv ? "bycontent_ratings" : "byrelease_dates",
    id,
    type_of: mediaType,
  });

  if (isTv) {
    const indiaRating = data?.results?.find(
      (country) => country.iso_3166_1 === "IN" && country.rating,
    )?.rating;
    return (
      indiaRating ||
      data?.results?.find((country) => country.rating)?.rating ||
      "N/A"
    );
  }

  const india = data?.results?.find((country) => country.iso_3166_1 === "IN");
  return (
    india?.release_dates?.find((release) => release.certification)?.certification ||
    "N/A"
  );
}