"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPerson } from "@/fetch/person";

/* ---------- small skeleton, same spirit as SeriesSkeleton ---------- */
function PersonSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] px-6 sm:px-12 lg:px-24 py-16">
      <div className="grid md:grid-cols-[240px_1fr] gap-8 max-w-[1200px] mx-auto">
        <div className="w-40 sm:w-52 aspect-[2/3] rounded-xl bg-white/5 animate-pulse mx-auto md:mx-0" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ---------- one poster card, reused across every filmography row ---------- */
function CreditCard({ credit }) {
  const router = useRouter();
  const title = credit.title || credit.name || "Untitled";
  const date = credit.release_date || credit.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const role = credit.job || credit.character || null;
  const href =
    credit.media_type === "tv" ? `/movie/${credit.id}?type=tv` : `/movie/${credit.id}?type=movie`;

  return (
    <div
      onClick={() => router.push(href)}
      className="flex-shrink-0 w-[130px] sm:w-[150px] cursor-pointer group"
    >
      <div className="aspect-[2/3] rounded-lg overflow-hidden border border-white/8 bg-[#141414]">
        <img
          src={
            credit.poster_path
              ? `https://image.tmdb.org/t/p/w342${credit.poster_path}`
              : "/placeholder.png"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-2 text-sm font-medium text-[#F2F0EA] leading-snug line-clamp-1">
        {title}
      </p>
      <p className="text-xs text-[#9A968C] mt-0.5 line-clamp-1">
        {[year, role].filter(Boolean).join(" · ")}
      </p>
    </div>
  );
}

/* ---------- a horizontal-scroll row for one role group (Directing, Acting, etc.) ---------- */
function FilmographyRow({ title, credits }) {
  if (!credits?.length) return null;
  return (
    <div className="mb-10">
      <h3 className="text-lg sm:text-xl text-[#F2F0EA] font-semibold mb-4">
        {title}
      </h3>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {credits.map((c) => (
          <CreditCard key={c.credit_id || `${c.id}-${c.job || c.character}`} credit={c} />
        ))}
      </div>
    </div>
  );
}

/* ---------- helpers: dedupe + sort a list of credits by year, newest first ---------- */
function sortByYearDesc(list) {
  return [...list].sort((a, b) => {
    const da = a.release_date || a.first_air_date || "";
    const db = b.release_date || b.first_air_date || "";
    return db.localeCompare(da);
  });
}

export default function PersonFilmography({ personId }) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPerson(personId).then((data) => {
      if (!mounted) return;
      setPerson(data);
      setLoading(false);
    });
    return () => (mounted = false);
  }, [personId]);

  if (loading) return <PersonSkeleton />;
  if (!person || person.success === false) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#9A968C]">
        Person not found.
      </div>
    );
  }

  const credits = person.combined_credits || {};
  const cast = credits.cast || [];
  const crew = credits.crew || [];

  const directing = sortByYearDesc(crew.filter((c) => c.job === "Director"));
  const creating = sortByYearDesc(crew.filter((c) => c.job === "Creator"));
  const writing = sortByYearDesc(
    crew.filter((c) => c.department === "Writing" && c.job !== "Creator")
  );
  const production = sortByYearDesc(
    crew.filter(
      (c) =>
        c.department === "Production" &&
        c.job !== "Creator" &&
        c.job !== "Director"
    )
  );
  const acting = sortByYearDesc(cast);

  const knownForDepartment = person.known_for_department;

  const profile = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : "/avatar.png";

  const age = person.birthday
    ? Math.floor(
        (person.deathday ? new Date(person.deathday) : new Date()) -
          new Date(person.birthday)
      ) / (1000 * 60 * 60 * 24 * 365.25)
    : null;

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#F2F0EA]">
      {/* ================= HEADER ================= */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-24 pt-16 pb-4">
        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          <img
            src={profile}
            alt={person.name}
            className="w-40 sm:w-full rounded-xl shadow-2xl mx-auto md:mx-0 aspect-[2/3] object-cover border border-white/8"
          />

          <div className="flex flex-col gap-3 text-center md:text-left mt-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
              {person.name}
            </h1>

            <p className="text-sm text-[#9A968C]">
              {knownForDepartment}
              {person.birthday &&
                ` · Born ${new Date(person.birthday).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}${age ? ` (age ${Math.floor(age)})` : ""}`}
              {person.place_of_birth && ` · ${person.place_of_birth}`}
            </p>

            {person.biography ? (
              <div className="max-w-2xl mx-auto md:mx-0">
                <p
                  className={`text-[#C9C6BC] leading-relaxed text-sm sm:text-base ${
                    showFullBio ? "" : "line-clamp-4"
                  }`}
                >
                  {person.biography}
                </p>
                {person.biography.length > 260 && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="mt-2 text-[#C9A227] text-sm font-medium hover:underline"
                  >
                    {showFullBio ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#9A968C]">No biography available.</p>
            )}
          </div>
        </div>
      </div>

      {/* ================= FILMOGRAPHY ================= */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-24 py-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 border-b border-white/8 pb-3">
          Filmography
        </h2>

        <FilmographyRow title="Creator" credits={creating} />
        <FilmographyRow title="Directing" credits={directing} />
        <FilmographyRow title="Writing" credits={writing} />
        <FilmographyRow title="Production" credits={production} />
        <FilmographyRow title="Acting" credits={acting} />

        {!directing.length &&
          !creating.length &&
          !writing.length &&
          !production.length &&
          !acting.length && (
            <p className="text-[#9A968C] text-sm">No filmography on record.</p>
          )}
      </div>
    </div>
  );
}