const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchMovies({type="discover",query = "",             // search text
  page = 1,
  genre = "",             // genre ID (28, 35, etc.)
  year = "",
  fromDate = "",
  toDate = "",
  sortBy = "popularity.desc",
  type_of="movie",
  id=""
 

} = {}) {
      let url = "";
      switch (type) {
        case "popular":
            url=`${BASE_URL}/${type_of}/popular`;
            break;
        case "top_rated":
            url=`${BASE_URL}/${type_of}/top_rated`;
            break;
    case "trending":
      url = `${BASE_URL}/trending/${type_of}/week`;
      break;

    case "search":
      url = `${BASE_URL}/search/${type_of}?query=${encodeURIComponent(query)}`;
      break;
    case "t_p":
      url =`${BASE_URL}/${type_of}/${encodeURIComponent(query)}`;
      break;
      case "byid":
        url =`${BASE_URL}/${type_of}/${id}`;
        break;
    default:
      url = `${BASE_URL}/discover/${type_of}`;
      }
    const params = new URLSearchParams({ page });
    if(genre) params.append("with_genres", genre);
    if (year) params.append("primary_release_year", year);
    if (fromDate) params.append("primary_release_date.gte", fromDate);
    if (toDate) params.append("primary_release_date.lte", toDate);
    if (sortBy && type === "discover") params.append("sort_by", sortBy);
    
   const finalUrl = url.includes("?")
    ? `${url}&${params.toString()}`
    : `${url}?${params.toString()}`;

  // Route requests through backend proxy so API key is not exposed to client
  const proxyPath = finalUrl.replace(BASE_URL, "");
  try {
    const res = await fetch(`/api/tmdb${proxyPath}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error("masterfetch: proxy request failed", res.status, `/api/tmdb${proxyPath}`);
      return {};
    }
    return await res.json();
  } catch (err) {
    console.error("masterfetch: fetch error", err);
    return {};
  }
 }
