"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

/**
 * SearchTips
 * Fills the empty space beside search results. When the current search
 * matches actors, directors, or other crew, it lists them here instead
 * of mixing them into the main title list. With no matching people (or
 * no search yet), it falls back to generic search guidance.
 *
 * Props:
 * - people — array of TMDB multi-search results with media_type "person".
 * - onExampleClick(query: string) — optional, for the fallback tips.
 *   If omitted, clicking an example routes to /search/[movie].
 */
const EXAMPLES = [
  { label: "Actor names", example: "Zendaya" },
  { label: "Movie titles", example: "Dune: Part Two" },
  { label: "TV series", example: "The Bear" },
];

const PANEL_CLASSES = `
  hidden lg:flex flex-col gap-6
  w-full max-w-[400px] p-6 
  p-6 rounded-2xl
  border border-white/10
  bg-[#121111]
  shadow-[0_0_40px_rgba(0,0,0,0.6)]
  sticky  top-8
`;

const PersonRow = ({ person, isFirst }) => {
  const router = useRouter();
  const role = person.known_for_department || "Person";
  const knownFor = person?.known_for
    ?.map((k) => k.title || k.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  return (
    <button
      type="button"
      onClick={() => router.push(`/person/${person.id}`)}
      className={`
        flex items-center gap-3 py-3 text-left cursor-pointer group
        ${isFirst ? "" : "border-t border-white/10"}
      `}
    >
      <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-white/5">
        <img
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
              : "/avatar.png"
          }
          alt={person.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-white truncate group-hover:text-purple-400 transition-colors">
          {person.name}
        </p>
        <p className="text-xs text-slate-400 truncate">
          {role}
          {knownFor ? ` · ${knownFor}` : ""}
        </p>
      </div>
    </button>
  );
};

const SearchTips = ({ people = [], onExampleClick }) => {
  const router = useRouter();

  const handleExampleClick = (example) => {
    if (onExampleClick) {
      onExampleClick(example);
    } else {
      router.push(`/search/${encodeURIComponent(example)}`);
    }
  };

  if (people.length > 0) {
    return (
      <div className={PANEL_CLASSES}>
        <div>
          <div className="text-lg font-bold text-white mb-1">
            <AnimatedShinyText>Cast & crew</AnimatedShinyText>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            People matching your search.
          </p>
        </div>

        <div className="flex flex-col">
          {people.map((person, i) => (
            <PersonRow key={person.id} person={person} isFirst={i === 0} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={PANEL_CLASSES + "  " }>
      <div className=""> 
        <div className="text-lg font-bold text-white mb-1">
          <AnimatedShinyText>Search tips</AnimatedShinyText>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Try actor names, movie titles, or TV series.
        </p>
      </div>

      <div className="flex flex-col">
        {EXAMPLES.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleExampleClick(item.example)}
            className={`
              group flex items-center justify-between gap-3
              py-3 text-left cursor-pointer
              ${i !== 0 ? "border-t border-white/10" : ""}
            `}
          >
            <span className="text-slate-400 text-xs font-semibold">
              {item.label}
            </span>
            <span
              className="
                text-sm text-white
                group-hover:text-purple-400
                transition-colors
              "
            >
              {item.example}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchTips;