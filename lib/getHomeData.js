import { fetchMovies } from "@/lib/masterfetch";
import connectDB from "@/db";
import EditorsPick from "@/models/editorsPick";
import Interested from "@/models/intested";
import "@/models/movie.models"; // ensures Movie model is registered for $lookup

async function fetchProviderPicks(providerId) {
  const [moviesRes, seriesRes] = await Promise.allSettled([
    fetchMovies({
      type: "provider",
      provider_id: providerId,
      watch_region: "IN",
      type_of: "movie",
    }),
    fetchMovies({
      type: "provider",
      provider_id: providerId,
      watch_region: "IN",
      type_of: "tv",
    }),
  ]);

  const movies =
    moviesRes.status === "fulfilled" ? moviesRes.value?.results || [] : [];
  const series =
    seriesRes.status === "fulfilled" ? seriesRes.value?.results || [] : [];

  return [
    ...movies.slice(0, 3).map((movie) => ({ ...movie, media_type: "movie" })),
    ...series.slice(0, 2).map((show) => ({ ...show, media_type: "tv" })),
  ];
}

export async function getHomeData() {
  const [
    trendingRes,
    netflixRes,
    primeRes,
    hotstarRes,
    editorsPickData,
    mostInterestedData,
  ] = await Promise.allSettled([
    // 1. Trending on NAC
    fetchMovies({ type: "trending", time: "day", type_of: "all" }),

    // 2. Netflix (provider 8): three movies and two series
    fetchProviderPicks(8),

    // 3. Prime Video (provider 119)
    fetchProviderPicks(119),

    // 4. JioHotstar (provider 2336)
    fetchProviderPicks(2336),

    // 5. Editor's Pick
    (async () => {
      try {
        await connectDB();
        const picks = await EditorsPick.find({})
          .sort({ order: 1, createdAt: -1 })
          .lean();

        if (picks && picks.length > 0) {
          return {
            movies: picks.map((p) => ({
              id: p.movieId,
              movieId: p.movieId,
              title: p.title,
              name: p.title,
              poster_path: p.poster_path,
              backdrop_path: p.backdrop_path,
              vote_average: p.vote_average,
              media_type: p.mediaType,
              curatorNote: p.curatorNote,
            })),
            isCustom: true,
          };
        }
      } catch (err) {
        console.error("getHomeData: EditorsPick DB query error:", err);
      }

      // Fallback to top_rated movies
      try {
        const topRated = await fetchMovies({ type: "top_rated", type_of: "movie" });
        return {
          movies: topRated?.results || [],
          isCustom: false,
        };
      } catch {
        return { movies: [], isCustom: false };
      }
    })(),

    // 6. Most Interested (Rightsidepanel)
    (async () => {
      try {
        await connectDB();
        const top = await Interested.aggregate([
          { $group: { _id: "$movie", count: { $sum: 1 }, type: { $first: "$type" } } },
          { $sort: { count: -1 } },
          { $limit: 12 },
          {
            $lookup: {
              from: "movies",
              localField: "_id",
              foreignField: "_id",
              as: "movie",
            },
          },
          { $unwind: "$movie" },
          { $project: { _id: 0, movieid: "$movie.movieid", count: 1, type: 1 } },
        ]);

        if (!top || top.length === 0) return [];

        const results = await Promise.all(
          top.map(async (t) => {
            try {
              const movie = await fetchMovies({
                type: "byid",
                id: t.movieid,
                type_of: t.type === "series" ? "tv" : "movie",
              });
              return {
                ...movie,
                interestedCount: t.count,
                interestedType: t.type,
              };
            } catch {
              return null;
            }
          })
        );
        return results.filter(Boolean);
      } catch (err) {
        console.error("getHomeData: MostInterested error:", err);
        return [];
      }
    })(),
  ]);

  return { 
    trending:
      trendingRes.status === "fulfilled" ? trendingRes.value?.results || [] : [],
    netflix:
      netflixRes.status === "fulfilled" ? netflixRes.value : [],
    prime:
      primeRes.status === "fulfilled" ? primeRes.value : [],
    hotstar:
      hotstarRes.status === "fulfilled" ? hotstarRes.value : [],
    editorsPick:
      editorsPickData.status === "fulfilled"
        ? editorsPickData.value
        : { movies: [], isCustom: false },
    mostInterested:
      mostInterestedData.status === "fulfilled" ? mostInterestedData.value : [],
  };
}
