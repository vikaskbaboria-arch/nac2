"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPerson } from "@/fetch/person";

/* ---------- small skeleton, same spirit as SeriesSkeleton ---------- */
function PersonSkeleton() {
  return (
    <main className="min-h-screen w-full bg-[#030000] text-white">
      <div className="h-[28vh] min-h-[180px] bg-white/[0.04] sm:h-[36vh] lg:h-[46vh]" />
      <div className="mx-auto -mt-14 w-full max-w-7xl px-4 sm:-mt-20 sm:px-8 lg:-mt-28 lg:px-12">
        <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-end gap-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8">
          <div className="aspect-[2/3] animate-pulse rounded-xl bg-white/10" />
          <div className="space-y-3 pb-1">
            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-8 w-2/3 animate-pulse rounded bg-white/10 sm:h-12" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
          </div>
        </div>
        <div className="mt-8 h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
      </div>
    </main>
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
    <button
      type="button"
      onClick={() => router.push(href)}
      className="group w-[118px] shrink-0 cursor-pointer text-left sm:w-[150px]"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#141414]">
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
      <p className="mt-2 line-clamp-1 text-sm font-medium leading-snug text-[#F2F0EA]">
        {title}
      </p>
      <p className="mt-0.5 line-clamp-1 text-xs text-[#9A968C]">
        {[year, role].filter(Boolean).join(" Â· ")}
      </p>
    </button>
  );
}

/* ---------- a horizontal-scroll row for one role group (Directing, Acting, etc.) ---------- */
function FilmographyRow({ title, credits }) {
  if (!credits?.length) return null;
  return (
    <section className="mb-10 min-w-0">
      <h3 className="mb-4 text-lg font-semibold text-[#F2F0EA] sm:text-xl">
        {title}
      </h3>
      <div className="no-scrollbar flex gap-3 overflow-x-auto overscroll-x-contain pb-2 sm:gap-4">
        {credits.map((c) => (
          <CreditCard key={c.credit_id || `${c.id}-${c.job || c.character}`} credit={c} />
        ))}
      </div>
    </section>
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
  const [loadedPersonId, setLoadedPersonId] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchPerson(personId).then((data) => {
      if (!mounted) return;
      setPerson(data);
      setLoadedPersonId(personId);
    }).catch((error) => {
      console.error("Failed to load person:", error);
      if (mounted) {
        setPerson(null);
        setLoadedPersonId(personId);
      }
    });
    return () => (mounted = false);
  }, [personId]);

  if (loadedPersonId !== personId) return <PersonSkeleton />;
  if (!person || person.success === false) {
    return (
      <main className="flex min-h-[70vh] w-full items-center justify-center bg-[#030000] px-4 text-center text-[#9A968C]">
        Person not found.
      </main>
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
        ((person.deathday ? new Date(person.deathday) : new Date()) -
          new Date(person.birthday)) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;
  const totalCredits = cast.length + crew.length;
  const crewDepartments = new Set(
    crew.map((credit) => credit.department).filter(Boolean)
  ).size;
  const formatPersonDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030000] text-[#F2F0EA]">
      <div className="h-[28vh] min-h-[190px] w-full bg-gradient-to-b from-[#101827] via-[#080b12] to-[#030000] sm:h-[38vh] lg:h-[48vh]" />

      <div className="relative z-10 mx-auto -mt-14 w-full max-w-7xl px-4 sm:-mt-20 sm:px-8 lg:-mt-28 lg:px-12">
        <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-end gap-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8">
          <img
            src={profile}
            alt={person.name}
            className="aspect-[2/3] w-full rounded-xl border border-white/10 object-cover object-top shadow-2xl sm:rounded-2xl"
          />

          <div className="min-w-0 pb-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-300 sm:text-xs">
              {knownForDepartment || "Film & Television"}
            </p>
            <h1 className="mt-1 break-words text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {person.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/65 sm:text-sm">
              {person.birthday && (
                <span>
                  Born {formatPersonDate(person.birthday)}
                  {!person.deathday && age !== null ? " (age " + Math.floor(age) + ")" : ""}
                </span>
              )}
              {person.deathday && <span>Died {formatPersonDate(person.deathday)}</span>}
              {person.place_of_birth && <span>{person.place_of_birth}</span>}
            </div>
          </div>
        </div>

        <section className="mt-7 sm:mt-9">
          <h2 className="mb-2 text-base font-semibold text-white sm:text-lg">Biography</h2>
          {person.biography ? (
            <>
              <p
                className={
                  "max-w-5xl text-sm leading-relaxed text-white/70 sm:text-base " +
                  (showFullBio ? "" : "line-clamp-4")
                }
              >
                {person.biography}
              </p>
              {person.biography.length > 260 && (
                <button
                  type="button"
                  onClick={() => setShowFullBio((value) => !value)}
                  className="mt-2 text-sm font-medium text-purple-300 transition hover:text-purple-200 hover:underline"
                >
                  {showFullBio ? "Show less" : "Show more"}
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-white/50">No biography available.</p>
          )}
        </section>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10 lg:px-12">
        <section className="min-w-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Filmography</h2>
            <p className="text-xs text-white/50 sm:text-sm">
              {totalCredits} {totalCredits === 1 ? "credit" : "credits"}
            </p>
          </div>

          <FilmographyRow title="Creator" credits={creating} />
          <FilmographyRow title="Directing" credits={directing} />
          <FilmographyRow title="Writing" credits={writing} />
          <FilmographyRow title="Production" credits={production} />
          <FilmographyRow title="Acting" credits={acting} />

          {!totalCredits && (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/55">
              No filmography on record.
            </p>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 lg:sticky lg:top-6">
          <h2 className="text-sm font-semibold text-white sm:text-base">Career summary</h2>
          <p className="mt-1 text-xs text-white/50">Credits listed for {person.name}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-black/25 p-3">
              <p className="text-2xl font-semibold text-white">{cast.length}</p>
              <p className="mt-1 text-[11px] text-white/50">Acting credits</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/25 p-3">
              <p className="text-2xl font-semibold text-white">{crew.length}</p>
              <p className="mt-1 text-[11px] text-white/50">Crew credits</p>
            </div>
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs text-white/50">Departments</p>
            <p className="mt-1 text-sm font-medium text-white">
              {crewDepartments || knownForDepartment || "Not available"}
              {crewDepartments ? (crewDepartments === 1 ? " department" : " departments") : ""}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
