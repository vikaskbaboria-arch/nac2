"use client";

import { useRef, useState } from "react";

const SeasonEpisodes = ({ movieId, seasons = [] }) => {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState({});
  const [seasonLoading, setSeasonLoading] = useState({});
  const [seasonErrors, setSeasonErrors] = useState({});
  const seasonRequests = useRef(new Map());

  if (!seasons.length) return null;

  const selectSeason = async (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    if (seasonDetails[seasonNumber] || seasonRequests.current.has(seasonNumber)) {
      return;
    }

    setSeasonLoading((current) => ({ ...current, [seasonNumber]: true }));
    setSeasonErrors((current) => ({ ...current, [seasonNumber]: null }));

    const request = (async () => {
      try {
        const response = await fetch(
          `/api/tmdb/tv/${movieId}/season/${seasonNumber}`,
        );
        if (!response.ok) {
          throw new Error("Could not load episodes for this season.");
        }

        const data = await response.json();
        setSeasonDetails((current) => ({ ...current, [seasonNumber]: data }));
      } catch (error) {
        setSeasonErrors((current) => ({
          ...current,
          [seasonNumber]: error.message || "Could not load this season.",
        }));
      } finally {
        setSeasonLoading((current) => ({ ...current, [seasonNumber]: false }));
        seasonRequests.current.delete(seasonNumber);
      }
    })();

    seasonRequests.current.set(seasonNumber, request);
    return request;
  };

  const activeSeason = seasons.find(
    (season) => season.season_number === selectedSeason,
  );
  const activeDetails = seasonDetails[selectedSeason];

  return (
    <section className="mt-10" aria-labelledby="seasons-heading">
      <h2
        id="seasons-heading"
        className="mb-4 text-lg font-semibold sm:text-xl"
      >
        Seasons &amp; Episodes
      </h2>

      <div
        role="tablist"
        aria-label="Seasons"
        className="mb-4 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {seasons.map((season) => {
          const isSelected = selectedSeason === season.season_number;

          return (
            <button
              key={season.id || season.season_number}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => selectSeason(season.season_number)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? "border-red-500 text-white"
                  : "border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.09] hover:text-white"
              }`}
            >
              {season.season_number === 0
                ? "Specials"
                : season.name || `Season ${season.season_number}`}
            </button>
          );
        })}
      </div>

      {selectedSeason !== null && (
        <div
          role="tabpanel"
          className="overflow-hidden   p-4 sm:p-5"
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-semibold text-white">
              {activeSeason?.season_number === 0
                ? "Specials"
                : activeSeason?.name || `Season ${selectedSeason}`}
            </h3>
            <p className="text-sm text-white/45">
              {activeSeason?.episode_count} {activeSeason?.episode_count === 1 ? "episode" : "episodes"}
              {activeSeason?.air_date
                ? ` · ${activeSeason.air_date.slice(0, 4)}`
                : ""}
            </p>
          </div>

          {seasonLoading[selectedSeason] ? (
            <p className="py-5 text-sm text-white/60">Loading episodes…</p>
          ) : seasonErrors[selectedSeason] ? (
            <div className="flex flex-wrap items-center justify-between gap-3 py-2">
              <p className="text-sm text-white/60">
                {seasonErrors[selectedSeason]}
              </p>
              <button
                type="button"
                onClick={() => selectSeason(selectedSeason)}
                className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/15"
              >
                Try again
              </button>
            </div>
          ) : activeDetails?.episodes?.length ? (
            <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {activeDetails.episodes.map((episode) => (
                <article
                  key={episode.id}
                  className="w-[250px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:w-[290px]"
                >
                  <img
                    src={
                      episode.still_path
                        ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                        : "/placeholder.png"
                    }
                    alt={`${episode.name || `Episode ${episode.episode_number}`} still`}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-300">
                      Episode {episode.episode_number}
                      {episode.air_date ? ` · ${episode.air_date}` : ""}
                    </p>
                    <h4 className="mt-1 line-clamp-2 min-h-12 font-semibold text-white">
                      {episode.name || `Episode ${episode.episode_number}`}
                    </h4>
                    {episode.overview && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">
                        {episode.overview}
                      </p>
                    )}
                    {episode.runtime && (
                      <p className="mt-2 text-xs text-white/40">
                        {episode.runtime} min
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-3 text-sm text-white/50">
              No episode details available for this season.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default SeasonEpisodes;
