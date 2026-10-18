"use client";

import React, { useEffect, useState } from "react";
import MovieCard from "@/components/media/MovieCard";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { fetchMovies } from "@/lib/masterfetch";
import { fetchPerson } from "@/fetch/person";

export default function MoreLikeThis({
  movieId,
  type = "movie",
  movie: initialMovie = null,
  credits: initialCredits = null,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadInfo, setLeadInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMoreLikeThis() {
      if (!movieId) return;
      setLoading(true);

      try {
        const mediaType = type === "tv" ? "tv" : "movie";

        // 1. Resolve movie details and genres
        let movieData = initialMovie;
        if (!movieData?.genres) {
          movieData = await fetchMovies({
            type: "byid",
            id: movieId,
            type_of: mediaType,
          });
        }
        if (cancelled) return;

        const currentGenreIds = (movieData?.genres || []).map((g) => g.id);
        const genreQuery = currentGenreIds.slice(0, 3).join(",");

        // 2. Identify director (movie) or showrunner/creator (tv)
        const crewList = initialCredits?.crew || [];
        const isTv = mediaType === "tv";

        let leadPerson = null;
        let leadRole = "Director";

        if (isTv) {
          const creator = movieData?.created_by?.[0];
          const crewShowrunner =
            crewList.find((c) => c.job === "Showrunner") ||
            crewList.find((c) => c.job === "Creator") ||
            crewList.find((c) => c.job === "Executive Producer") ||
            crewList.find((c) => c.department === "Directing");

          leadPerson = creator || crewShowrunner || null;
          leadRole = creator || crewShowrunner?.job === "Showrunner" ? "Showrunner" : "Director";
        } else {
          const director =
            crewList.find((c) => c.job === "Director") ||
            crewList.find((c) => c.department === "Directing");

          leadPerson = director || null;
          leadRole = "Director";
        }

        if (leadPerson) {
          setLeadInfo({ name: leadPerson.name, role: leadRole });
        } else {
          setLeadInfo(null);
        }

        // 3. Fetch candidate pools in parallel
        const fetchPromises = [
          // A: Official TMDB Recommendations
          fetchMovies({
            type: "recommendations",
            id: movieId,
            type_of: mediaType,
          }).catch(() => ({ results: [] })),

          // B: Discover titles sharing the same genres
          genreQuery
            ? fetchMovies({
                type: "discover",
                type_of: mediaType,
                genre: genreQuery,
                sortBy: "popularity.desc",
              }).catch(() => ({ results: [] }))
            : Promise.resolve({ results: [] }),
        ];

        // C: Works by the same director / showrunner if available
        if (leadPerson?.id) {
          fetchPromises.push(
            fetchPerson(leadPerson.id)
              .then((personDetails) => {
                const credits = personDetails?.combined_credits || {};
                const leadWorks = [
                  ...(credits.crew || []),
                  ...(credits.cast || []),
                ];

                // Filter titles directed/created by this lead person
                const directedOrCreated = leadWorks.filter((item) => {
                  if (isTv) {
                    return (
                      item.job === "Director" ||
                      item.job === "Showrunner" ||
                      item.job === "Creator" ||
                      item.job === "Executive Producer" ||
                      item.department === "Directing"
                    );
                  }
                  return (
                    item.job === "Director" ||
                    item.department === "Directing"
                  );
                });

                return (directedOrCreated.length > 0 ? directedOrCreated : leadWorks).map(
                  (work) => ({
                    ...work,
                    __leadMatch: true,
                    __leadRole: leadRole,
                    __leadName: leadPerson.name,
                  })
                );
              })
              .catch(() => [])
          );
        }

        const [recommendationsRes, discoverRes, leadWorksRes = []] =
          await Promise.all(fetchPromises);

        if (cancelled) return;

        const recResults = recommendationsRes?.results || [];
        const discResults = discoverRes?.results || [];

        // 4. Combine and deduplicate candidates
        const candidateMap = new Map();

        const addCandidate = (item, isLead = false) => {
          if (!item?.id) return;
          const idNum = Number(item.id);
          if (idNum === Number(movieId)) return; // Exclude current movie
          if (!item.poster_path) return; // Must have poster image

          if (candidateMap.has(idNum)) {
            const existing = candidateMap.get(idNum);
            if (isLead) {
              existing.__leadMatch = true;
              existing.__leadRole = leadRole;
              existing.__leadName = leadPerson?.name;
            }
          } else {
            candidateMap.set(idNum, {
              ...item,
              media_type: item.media_type || mediaType,
              __leadMatch: Boolean(isLead || item.__leadMatch),
              __leadRole: item.__leadRole || (isLead ? leadRole : undefined),
              __leadName: item.__leadName || (isLead ? leadPerson?.name : undefined),
            });
          }
        };

        // Add lead person's works first
        leadWorksRes.forEach((item) => addCandidate(item, true));
        // Add recommendations
        recResults.forEach((item) => addCandidate(item));
        // Add same-genre discover results
        discResults.forEach((item) => addCandidate(item));

        const candidateList = Array.from(candidateMap.values());

        // 5. Score candidates according to user criteria:
        // - Boost heavily if by the same director / showrunner
        // - Boost for sharing genres
        // - Factor in vote quality
        const scored = candidateList.map((item) => {
          let score = 0;

          // Same director / showrunner priority
          if (item.__leadMatch) {
            score += 250;
          }

          // Same genre weighting
          const itemGenreIds =
            item.genre_ids || (item.genres || []).map((g) => g.id) || [];
          const sharedGenreCount = itemGenreIds.filter((gid) =>
            currentGenreIds.includes(gid)
          ).length;

          score += sharedGenreCount * 30;

          // Rating / popularity
          score += (item.vote_average || 0) * 3;
          score += Math.min((item.vote_count || 0) / 100, 10);

          return { item, score };
        });

        scored.sort((a, b) => b.score - a.score);

        // Take top 5-6 titles as requested
        const topPicks = scored.slice(0, 6).map(({ item }) => item);

        setItems(topPicks);
      } catch (err) {
        console.error("MoreLikeThis: failed to load recommendations", err);
        setItems([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMoreLikeThis();

    return () => {
      cancelled = true;
    };
  }, [movieId, type, initialMovie, initialCredits]);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className="mb-4 text-lg font-semibold sm:text-xl">More Like This</h2>

      {loading ? (
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-4 sm:p-3 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full rounded-xl p-2">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl skeleton-shimmer border border-white/[0.08] shadow-lg shadow-black/40" />
              <div className="mt-2.5 h-4 w-4/5 rounded-md skeleton-shimmer border border-white/[0.05]" />
              <div className="mt-2 h-3 w-2/5 rounded-md skeleton-shimmer border border-white/[0.04]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-4 sm:p-3 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((m) => (
            <MovieCard key={m.id} movie={m} typeFallback={type} />
          ))}
        </div>
      )}
    </section>
  );
}
